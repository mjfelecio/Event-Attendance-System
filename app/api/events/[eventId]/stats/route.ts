import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { buildEventStudentFilter } from "@/globals/utils/buildEventStudentFilter";
import { handlePrismaError } from "@/globals/utils/prismaError";
import { AttendanceStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const { eventId } = await params;

    if (!eventId) {
      return NextResponse.json(err("Missing event id"), { status: 400 });
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      return NextResponse.json(err("Event not found"), { status: 404 });
    }

    // Eligible students based on event criteria
    const eligibleStudentsCount = await prisma.student.count({
      where: buildEventStudentFilter(event),
    });

    // Students who actually attended
    const presentStudentsCount = await prisma.record.count({
      where: {
        eventId,
        status: {
          in: [AttendanceStatus.PRESENT, AttendanceStatus.LATE],
        },
      },
    });

    const absentStudentsCount =
      eligibleStudentsCount - presentStudentsCount;

    return NextResponse.json(
      ok({
        eligible: eligibleStudentsCount,
        present: presentStudentsCount,
        absent: absentStudentsCount,
      }),
      { status: 200 }
    );
  } catch (e) {
    const { message, status } = handlePrismaError(e);
    return NextResponse.json(err(message), { status });
  }
}
