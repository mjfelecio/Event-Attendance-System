import { prisma } from "@/globals/libs/prisma";
import { StudentAttendanceRecord } from "@/globals/types/students";
import { err, ok } from "@/globals/utils/api";
import { fullName } from "@/globals/utils/formatting";
import { handlePrismaError } from "@/globals/utils/prismaError";
import { NextResponse } from "next/server";

// Fetch all attendance record of a specific event
export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  const { eventId } = await params;

  try {
    const recordsWithStudent: any = await prisma.record.findMany({
      where: { eventId },
      select: {
        id: true,
        status: true,
        eventId: true,
        studentId: true,
        createdAt: true,
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

    const records: StudentAttendanceRecord[] = recordsWithStudent.map(
      (r: any) => ({
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
        timestamp: r.createdAt,
      })
    );

    return NextResponse.json(ok(records), { status: 200 });
  } catch (e) {
    const { message, status } = handlePrismaError(e);
    return NextResponse.json(err(message), { status });
  }
}
