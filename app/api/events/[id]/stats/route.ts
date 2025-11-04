import { prisma } from "@/globals/libs/prisma";
import { buildEventStudentFilter } from "@/globals/utils/buildEventStudentFilter";
import { AttendanceStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // eventId
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing event id" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Eligible students based on event criteria
    const eligibleStudentsCount = await prisma.student.count({
      where: buildEventStudentFilter(event),
    });

    // Students who actually attended
    const presentStudentsCount = await prisma.record.count({
      where: {
        eventId: id,
        status: {
          in: [AttendanceStatus.PRESENT, AttendanceStatus.LATE],
        },
      },
    });

    const unattendedStudentsCount =
      eligibleStudentsCount - presentStudentsCount;

    return NextResponse.json(
      {
        data: {
          eligible: eligibleStudentsCount,
          present: presentStudentsCount,
          unattended: unattendedStudentsCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch event stats" },
      { status: 500 }
    );
  }
}
