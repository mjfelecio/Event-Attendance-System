import { NextResponse } from "next/server";

import { prisma } from "@/globals/libs/prisma";
import { StudentAttendanceRecord } from "@/globals/types/students";
import { ok } from "@/globals/utils/api";
import { fullName } from "@/globals/utils/formatting";
import { assertEventVisibility, requireAuth } from "@/globals/utils/auth";
import { respondWithError } from "@/globals/utils/httpError";

// Fetch all attendance record of a specific event
export async function GET(
  req: Request,
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

    const recordsWithStudent = await prisma.record.findMany({
      where: { eventId },
      select: {
        id: true,
        status: true,
        eventId: true,
        studentId: true,
        createdAt: true,
        timein: true,
        timeout: true,
        student: {
          select: {
            firstName: true,
            middleName: true,
            lastName: true,
            schoolLevel: true,
            section: true,
          },
        },
      },
    });

    type RecordWithStudent = typeof recordsWithStudent[number];

    const records: StudentAttendanceRecord[] = recordsWithStudent.map(
      (r: RecordWithStudent) => ({
        id: r.id,
        status: r.status,
        eventId: r.eventId,
        studentId: r.studentId,
        fullName: fullName(
          r.student.firstName,
          r.student.middleName,
          r.student.lastName
        ),
        schoolLevel: r.student.schoolLevel,
        section: r.student.section,
        timein: r.timein,
        timeout: r.timout,
      })
    );

    return NextResponse.json(ok(records), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
