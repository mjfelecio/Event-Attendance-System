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

    if (!existing) {
      const created = await prisma.record.create({
        data: {
          eventId,
          studentId,
          method,
          timein: event.isTimeout ? undefined : now,
          timeout: event.isTimeout ? now : undefined,
        },
      });

      return NextResponse.json(ok(created), { status: 201 });
    }

    // Time-in: first scan wins - never overwrite an existing time-in.
    // Time-out: latest scan wins - the student's final scan-out is kept.
    const updated = await prisma.record.update({
      where: { id: existing.id },
      data: event.isTimeout
        ? { timeout: now }
        : existing.timein
          ? {}
          : { timein: now },
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
