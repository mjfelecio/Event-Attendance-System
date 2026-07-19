import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import {
  assertEventOwnership,
  assertEventStatus,
  assertEventVisibility,
  requireAuth,
  requireRole,
} from "@/globals/utils/auth";
import { respondWithError } from "@/globals/utils/httpError";
import { validateEventGroups } from "@/globals/utils/eventValidation";

const submitSchema = z.object({ action: z.enum(["SUBMIT", "APPROVE", "REJECT"]) });
const rejectionSchema = z.object({ reason: z.string().min(1) });

const jsonArrayField = z
  .string()
  .nullable()
  .optional()
  .refine(
    (v) => {
      if (!v) return true;
      try {
        return Array.isArray(JSON.parse(v));
      } catch {
        return false;
      }
    },
    { message: "Must be a JSON array." }
  );

const patchSchema = z
  .object({
    title: z.string().trim().min(1),
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
    includedGroups: jsonArrayField,
    excludedGroups: jsonArrayField,
    description: z.string().nullable().optional(),
    start: z.coerce.date(),
    end: z.coerce.date(),
    allDay: z.boolean().optional().default(false),
  })
  .refine((data) => data.end.getTime() >= data.start.getTime(), {
    message: "End must be the same or after start.",
    path: ["end"],
  });

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await requireAuth();
    const { eventId } = await params;

    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      return NextResponse.json(err("Event not found."), { status: 404 });
    }

    assertEventVisibility(event, user);

    return NextResponse.json(ok(event), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await requireAuth();
    const { eventId } = await params;
    const payload = await req.json();

    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      return NextResponse.json(err("Event not found."), { status: 404 });
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
        // DRAFT is intentionally not approvable: drafts must be submitted
        // first so the approval always reviews a finished event.
        assertEventStatus(event, ["PENDING", "REJECTED", "APPROVED"]);
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

    // Default PATCH behavior: editing event content.
    // Non-admins can only edit drafts and rejected events; approved events
    // are locked so content cannot change without re-review.
    const data = patchSchema.parse(payload);

    const groupError = validateEventGroups(
      data.category,
      data.includedGroups,
      data.excludedGroups
    );
    if (groupError) {
      return NextResponse.json(err(groupError), { status: 400 });
    }

    assertEventOwnership(event, user);
    assertEventStatus(
      event,
      user.role === "ADMIN"
        ? ["DRAFT", "PENDING", "APPROVED", "REJECTED"]
        : ["DRAFT", "REJECTED"]
    );

    // Editing a rejected event returns it to DRAFT (clearing the review)
    // so the organizer can fix it and resubmit.
    const rejectionReset =
      user.role !== "ADMIN" && event.status === "REJECTED"
        ? {
            status: "DRAFT" as const,
            reviewedById: null,
            reviewedAt: null,
            rejectionReason: null,
          }
        : {};

    const updated = await prisma.event.update({
      where: { id: eventId },
      data: { ...data, ...rejectionReset },
    });

    return NextResponse.json(ok(updated), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await requireAuth();
    const { eventId } = await params;

    const existing = await prisma.event.findUnique({ where: { id: eventId } });
    if (!existing) {
      return NextResponse.json(err("Event not found."), { status: 404 });
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

    await prisma.event.delete({ where: { id: eventId } });

    return NextResponse.json(ok(null), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
