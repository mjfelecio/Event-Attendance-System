import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/globals/libs/prisma";
import { ok } from "@/globals/utils/api";
import {
  assertEventOwnership,
  assertEventStatus,
  requireAuth,
  requireRole,
} from "@/globals/utils/auth";
import { respondWithError } from "@/globals/utils/httpError";

const eventStatusEnum = z.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED"]);
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

    if (user.role !== "ADMIN") {
      where.createdById = user.id;
    }

    if (query.success && query.data.status) {
      where.status = query.data.status;
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
      assertEventStatus(existing, "DRAFT");

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
    assertEventStatus(existing, "DRAFT");

    await prisma.event.delete({ where: { id } });

    return NextResponse.json(ok(null), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
