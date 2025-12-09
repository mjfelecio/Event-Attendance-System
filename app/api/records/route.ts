import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { handlePrismaError } from "@/globals/utils/prismaError";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const created = await prisma.record.create({
      data: body,
    });

    return NextResponse.json(ok(created), { status: 201 });
  } catch (e) {
    const { status, message } = handlePrismaError(e);
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
