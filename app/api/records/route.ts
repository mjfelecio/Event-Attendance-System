import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/globals/libs/prisma";

export async function POST(req: Request) {
  try {
    const { eventId, studentId, status, method } = await req.json();

    const alreadyExists = await prisma.record.findUnique({
      where: { eventId_studentId: { eventId, studentId } },
    });

    if (alreadyExists) {
      console.error("This record already exists");
      return NextResponse.json(
        { message: "This record already exists" },
        { status: 409 }
      );
    }

    const record = await prisma.record.create({
      data: { eventId, studentId, status, method },
    });

    return NextResponse.json({ record }, { status: 201 });
  } catch (error) {
    console.error("Failed to create record: ", error);
    return NextResponse.json(
      { message: "Failed to create record." },
      { status: 500 }
    );
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

      return NextResponse.json(record, { status: 200 });
    }

    // Fetch all records of an event
    if (eventId) {
      const records = await prisma.record.findMany({
        where: { eventId: eventId },
      });

      return NextResponse.json(records, { status: 200 });
    }

    // Fetch all records of a student, from all events
    if (studentId) {
      const records = await prisma.record.findMany({
        where: { studentId: studentId },
      });

      return NextResponse.json(records, { status: 200 });
    }

    // When no searchParams is found, fetch all records
    const allRecords = await prisma.record.findMany();

    return NextResponse.json(allRecords, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching record:", error);

    return NextResponse.json(
      {
        error:
          error.message ??
          "Unknown server error occured while fetching records",
      },
      { status: 500 }
    );
  }
}
