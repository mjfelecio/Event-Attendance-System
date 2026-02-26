import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { handlePrismaError } from "@/globals/utils/prismaError";
import { buildEventStudentFilter } from "@/globals/utils/buildEventStudentFilter";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, studentId, ...rest } = body;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        err("Cannot create record with no event attached."),
        { status: 404 },
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

    // Determine the update/create payload based on the event type
    const recordData = {
      timein: event.isTimeout ? undefined : now,
      timeout: event.isTimeout ? now : undefined,
    };

    // Use upsert to create if new, or update timestamps if exists
    const result = await prisma.record.upsert({
      where: {
        eventId_studentId: {
          eventId: eventId,
          studentId: studentId,
        },
      },
      update: {
        ...recordData,
      },
      create: {
        eventId,
        studentId,
        ...rest,
        ...recordData,
      },
    });

    const isNew = result.createdAt.getTime() === result.updatedAt.getTime();
    return NextResponse.json(ok(result), { status: isNew ? 201 : 200 });
  } catch (e) {
    const { status, message } = handlePrismaError(e);
    console.warn(JSON.stringify(e));
    return NextResponse.json(err(message), { status });
  }
}

/**
 * Fetches a record based on an eventId and a studentId
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  const studentId = searchParams.get("studentId");

  try {
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
  } catch (e) {
    const { status, message } = handlePrismaError(e);
    return NextResponse.json(err(message), { status });
  }
}
