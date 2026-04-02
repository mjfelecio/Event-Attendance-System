import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import {
  assertEventOwnership,
  assertEventStatus,
  requireAuth,
  requireRole,
} from "@/globals/utils/auth";
import { respondWithError } from "@/globals/utils/httpError";
import { eventSchema } from "@/globals/schemas";
import { toDate } from "@/globals/utils/events";

const eventStatusEnum = z.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED"]);
const eventScopeEnum = z.enum(["visible", "mine"]);

const listQuerySchema = z.object({
  status: eventStatusEnum.optional(),
  scope: eventScopeEnum.optional(),
});

const deleteSchema = z.object({ id: z.string().min(1) });

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const query = listQuerySchema.safeParse(
      Object.fromEntries(new URL(req.url).searchParams),
    );

    const where: Record<string, unknown> = {};
    const statusFilter = query.success ? query.data.status : undefined;
    const scopeFilter = query.success ? query.data.scope : undefined;

    if (user.role === "ADMIN") {
      if (statusFilter) {
        where.status = statusFilter;
      }
    } else {
      const resolvedScope = scopeFilter ?? "visible";

      if (resolvedScope === "mine") {
        where.createdById = user.id;

        if (statusFilter) {
          where.status = statusFilter;
        }
      } else if (!statusFilter) {
        where.OR = [{ createdById: user.id }, { status: "APPROVED" }];
      } else if (statusFilter === "APPROVED") {
        where.status = "APPROVED";
      } else {
        where.createdById = user.id;
        where.status = statusFilter;
      }
    }

    const rawEvents = await prisma.event.findMany({
      where,
      include: {
        includedGroups: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { start: "asc" },
    });

    const events = rawEvents.map((event) => ({
      ...event,
      includedGroups: event.includedGroups.map((group) => group.id),
    }));

    return NextResponse.json(ok(events), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const rawData = await req.json();

    const payload = eventSchema.parse({
      ...rawData,
      start: toDate(rawData.start),
      end: toDate(rawData.end),
    });

    const baseData = {
      title: payload.title,
      location: payload.location,
      category: payload.category,
      includedGroups: payload.includedGroups,
      description: payload.description,
      start: payload.start,
      end: payload.end,
      allDay: payload.allDay,
    };

    if (payload.id) {
      const existing = await prisma.event.findUnique({
        where: { id: payload.id },
      });

      if (!existing) {
        return NextResponse.json(ok(null), { status: 404 });
      }

      assertEventOwnership(existing, user);
      const editableStatuses: Array<
        "DRAFT" | "PENDING" | "APPROVED" | "REJECTED"
      > =
        user.role === "ADMIN"
          ? ["DRAFT", "PENDING", "APPROVED", "REJECTED"]
          : ["DRAFT", "APPROVED", "REJECTED"];
      assertEventStatus(existing, editableStatuses);

      const updated = await prisma.event.update({
        where: { id: payload.id },
        data: {
          ...baseData,
          includedGroups: {
            set: baseData.includedGroups.map((g) => ({ id: g })),
          },
        },
      });

      return NextResponse.json(ok(updated), { status: 200 });
    }

    requireRole(user, ["ORGANIZER", "ADMIN"]);

    const created = await prisma.event.create({
      data: {
        ...baseData,
        status: "DRAFT",
        createdById: user.id,
        includedGroups: {
          connect: baseData.includedGroups.map((g) => ({ id: g })),
        },
      },
    });

    return NextResponse.json(ok(created), { status: 201 });
  } catch (error) {
    return respondWithError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await requireAuth();
    const { id } = deleteSchema.parse(await req.json());

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(ok(null), { status: 404 });
    }

    assertEventOwnership(existing, user);

    const attendanceCount = await prisma.record.count({
      where: { eventId: existing.id },
    });

    if (attendanceCount > 0) {
      return NextResponse.json(
        err(
          "Cannot delete this event because attendance has already been recorded.",
          "EVENT_HAS_RECORDS",
        ),
        { status: 409 },
      );
    }

    await prisma.event.delete({ where: { id } });

    return NextResponse.json(ok(null), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
