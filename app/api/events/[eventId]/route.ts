import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/globals/libs/prisma";
import { ok } from "@/globals/utils/api";
import {
  assertEventOwnership,
  assertEventStatus,
  assertEventVisibility,
  requireAuth,
  requireRole,
} from "@/globals/utils/auth";
import { respondWithError } from "@/globals/utils/httpError";

const submitSchema = z.object({ action: z.enum(["SUBMIT", "APPROVE", "REJECT"]) });
const rejectionSchema = z.object({ reason: z.string().min(1) });
const patchSchema = z.object({
  title: z.string().min(1),
  location: z.string().nullable().optional(),
  category: z.enum([
    "ALL",
    "COLLEGE",
    "SHS",
    "DEPARTMENT",
    "HOUSE",
    "STRAND",
    "PROGRAM",
    "SECTION",
    "YEAR",
  ]),
  includedGroups: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  start: z.coerce.date(),
  end: z.coerce.date(),
  allDay: z.boolean().optional().default(false),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const user = await requireAuth();
    const { eventId } = await params;

    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      return NextResponse.json(ok(null), { status: 404 });
    }

    assertEventVisibility(event, user);

    return NextResponse.json(ok(event), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const user = await requireAuth();
    const { eventId } = await params;
    const payload = await req.json();

    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      return NextResponse.json(ok(null), { status: 404 });
    }

    const actionParse = submitSchema.safeParse(payload);
    if (actionParse.success) {
      const action = actionParse.data.action;

      if (action === "SUBMIT") {
        assertEventOwnership(event, user);
        assertEventStatus(event, "DRAFT");

        const updated = await prisma.event.update({
          where: { id: eventId },
          data: { status: "PENDING", reviewedById: null, rejectionReason: null, reviewedAt: null },
        });

        return NextResponse.json(ok(updated), { status: 200 });
      }

      requireRole(user, "ADMIN");

      if (action === "APPROVE") {
        assertEventStatus(event, ["PENDING", "DRAFT"]);
        const approved = await prisma.event.update({
          where: { id: eventId },
          data: {
            status: "APPROVED",
            reviewedById: user.id,
            reviewedAt: new Date(),
            rejectionReason: null,
          },
        });

        return NextResponse.json(ok(approved), { status: 200 });
      }

      if (action === "REJECT") {
        assertEventStatus(event, "PENDING");
        const { reason } = rejectionSchema.parse(payload);

        const rejected = await prisma.event.update({
          where: { id: eventId },
          data: {
            status: "REJECTED",
            reviewedById: user.id,
            reviewedAt: new Date(),
            rejectionReason: reason,
          },
        });

        return NextResponse.json(ok(rejected), { status: 200 });
      }
    }

    // Default PATCH behavior: organizer editing draft event content
    const data = patchSchema.parse(payload);
    assertEventOwnership(event, user);
    assertEventStatus(event, "DRAFT");

    const updated = await prisma.event.update({
      where: { id: eventId },
      data,
    });

    return NextResponse.json(ok(updated), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const user = await requireAuth();
    const { eventId } = await params;

    const existing = await prisma.event.findUnique({ where: { id: eventId } });
    if (!existing) {
      return NextResponse.json(ok(null), { status: 404 });
    }

    assertEventOwnership(existing, user);
    assertEventStatus(existing, "DRAFT");

    await prisma.event.delete({ where: { id: eventId } });

    return NextResponse.json(ok(null), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
