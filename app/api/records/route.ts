import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { requireAuth } from "@/globals/utils/auth";
import { respondWithError } from "@/globals/utils/httpError";
import { buildEventStudentFilter } from "@/globals/utils/buildEventStudentFilter";

const createRecordSchema = z.object({
  eventId: z.string().min(1),
  studentId: z.string().min(1),
  method: z.enum(["MANUAL", "SCANNED"]),
});

export async function POST(req: Request) {
  try {
    await requireAuth();

    const { eventId, studentId, method } = createRecordSchema.parse(
      await req.json()
    );

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        err("Cannot create record with no event attached."),
        { status: 404 }
      );
    }

    const student = await prisma.student.findUnique({
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
    // time-out is only possible after a time-in.
    if (event.isTimeout) {
      if (!existing || !existing.timein) {
        return NextResponse.json(
          err("Student has not timed in for this event.", "NO_TIME_IN"),
          { status: 409 }
        );
      }

      if (existing.timeout) {
        // Already timed out - single scan, keep the first one.
        return NextResponse.json(ok(existing), { status: 200 });
      }

      const updated = await prisma.record.update({
        where: { id: existing.id },
        data: { timeout: now },
      });

      return NextResponse.json(ok(updated), { status: 200 });
    }

    if (!existing) {
      const created = await prisma.record.create({
        data: {
          eventId,
          studentId,
          method,
          timein: now,
        },
      });

      return NextResponse.json(ok(created), { status: 201 });
    }

    if (existing.timein) {
      // Already timed in - single scan, keep the first one.
      return NextResponse.json(ok(existing), { status: 200 });
    }

    const updated = await prisma.record.update({
      where: { id: existing.id },
      data: { timein: now },
    });

    return NextResponse.json(ok(updated), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}

/**
 * Fetches a record based on an eventId and a studentId
 */
export async function GET(req: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const studentId = searchParams.get("studentId");

    // Fetch a student record from a specific event
    if (eventId && studentId) {
      const record = await prisma.record.findUnique({
        where: { eventId_studentId: { eventId, studentId } },
      });

      return NextResponse.json(ok(record), { status: 200 });
    }

    // Fetch all records of an event
    if (eventId) {
      const records = await prisma.record.findMany({
        where: { eventId: eventId },
      });

      return NextResponse.json(ok(records), { status: 200 });
    }

    // Fetch all records of a student, from all events
    if (studentId) {
      const records = await prisma.record.findMany({
        where: { studentId: studentId },
      });

      return NextResponse.json(ok(records), { status: 200 });
    }

    // When no searchParams is found, fetch all records
    const allRecords = await prisma.record.findMany();

    return NextResponse.json(ok(allRecords), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
