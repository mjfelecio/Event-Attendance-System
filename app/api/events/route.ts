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

const eventStatusEnum = z.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED"]);
const eventScopeEnum = z.enum(["visible", "mine"]);
const eventCategoryEnum = z.enum([
  "ALL",
  "COLLEGE",
  "SHS",
  "DEPARTMENT",
  "HOUSE",
  "STRAND",
  "PROGRAM",
  "SECTION",
  "YEAR",
]);

const listQuerySchema = z.object({
  status: eventStatusEnum.optional(),
  scope: eventScopeEnum.optional(),
});

const eventMutationSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  location: z.string().nullable().optional(),
  category: eventCategoryEnum,
  includedGroups: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  start: z.coerce.date(),
  end: z.coerce.date(),
  allDay: z.boolean().optional().default(false),
});

const deleteSchema = z.object({ id: z.string().min(1) });

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const query = listQuerySchema.safeParse(
      Object.fromEntries(new URL(req.url).searchParams)
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

    const events = await prisma.event.findMany({
      where,
      orderBy: { start: "asc" },
    });

    return NextResponse.json(ok(events), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const payload = eventMutationSchema.parse(await req.json());

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
        data: baseData,
      });

      return NextResponse.json(ok(updated), { status: 200 });
    }

    requireRole(user, ["ORGANIZER", "ADMIN"]);

    const created = await prisma.event.create({
      data: {
        ...baseData,
        status: "DRAFT",
        createdById: user.id,
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
          "EVENT_HAS_RECORDS"
        ),
        { status: 409 }
      );
    }

    await prisma.event.delete({ where: { id } });

    return NextResponse.json(ok(null), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
