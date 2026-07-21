import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import {
  assertEventStatus,
  assertEventVisibility,
  requireAuth,
} from "@/globals/utils/auth";
import { respondWithError } from "@/globals/utils/httpError";
import { buildEventStudentFilter } from "@/globals/utils/buildEventStudentFilter";

const createRecordSchema = z.object({
  eventId: z.string().min(1),
  studentId: z.string().min(1),
  method: z.enum(["MANUAL", "SCANNED"]),
});

export async function POST(req: Request) {
  try {
    const user = await requireAuth();

    const { eventId, studentId, method } = createRecordSchema.parse(
      await req.json()
    );

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { includedGroups: true }
    });

    if (!event) {
      return NextResponse.json(
        err("Cannot create record with no event attached."),
        { status: 404 }
      );
    }

    // Policy: attendance is writable on ANY approved event the user can see,
    // with no start/end time-window restriction. This is intentional so
    // organizers can set up early and make late corrections; approval is the
    // only gate. (If a stricter window is ever wanted, add it here.)
    assertEventVisibility(event, user);
    assertEventStatus(event, "APPROVED");

    // findFirst (not findUnique): the eligibility filter adds non-unique
    // group conditions on top of the id, so the where isn't a unique selector.
    const student = await prisma.student.findFirst({
      where: { id: studentId, ...buildEventStudentFilter(event) },
    });

    if (!student) {
      return NextResponse.json(err("Student is not included in the event."), {
        status: 404,
      });
    }

    const now = new Date();

    const existing = await prisma.record.findUnique({
      where: { eventId_studentId: { eventId, studentId } },
    });

    // Scan rules: exactly one scan each for time-in and time-out, and a
    // time-out is only possible after a time-in. Writes are conditional
    // (compare-and-set) so concurrent scans cannot overwrite the first one.
    if (event.isTimeout) {
      if (!existing || !existing.timein) {
        return NextResponse.json(
          err("Student has not timed in for this event.", "NO_TIME_IN"),
          { status: 409 }
        );
      }

      if (!existing.timeout) {
        await prisma.record.updateMany({
          where: { id: existing.id, timeout: null },
          data: { timeout: now, lastModifiedById: user.id },
        });
      }

      const current = await prisma.record.findUnique({
        where: { id: existing.id },
      });
      return NextResponse.json(ok(current), { status: 200 });
    }

    if (!existing) {
      try {
        const created = await prisma.record.create({
          data: {
            eventId,
            studentId,
            method,
            timein: now,
            recordedById: user.id,
          },
        });

        return NextResponse.json(ok(created), { status: 201 });
      } catch (createError: unknown) {
        // Unique constraint hit: another scan created the record first -
        // fall through and return that record untouched.
        const code = (createError as { code?: string })?.code;
        if (code !== "P2002") throw createError;
      }
    } else if (!existing.timein) {
      await prisma.record.updateMany({
        where: { id: existing.id, timein: null },
        data: { timein: now, lastModifiedById: user.id },
      });
    }

    const current = await prisma.record.findUnique({
      where: { eventId_studentId: { eventId, studentId } },
    });
    return NextResponse.json(ok(current), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}

/**
 * Fetches attendance records scoped to an event the user is allowed to see.
 * eventId is required; add studentId for a single student's record.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const studentId = searchParams.get("studentId");

    if (!eventId) {
      return NextResponse.json(
        err("eventId query parameter is required."),
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json(err("Event not found."), { status: 404 });
    }

    assertEventVisibility(event, user);

    if (studentId) {
      const record = await prisma.record.findUnique({
        where: { eventId_studentId: { eventId, studentId } },
      });

      return NextResponse.json(ok(record), { status: 200 });
    }

    const records = await prisma.record.findMany({
      where: { eventId },
    });

    return NextResponse.json(ok(records), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
