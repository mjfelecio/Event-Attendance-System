import { prisma } from "@/globals/libs/prisma";
import { StudentAttendanceRecord } from "@/globals/types/students";
import { fullName } from "@/globals/utils/formatting";
import { NextResponse } from "next/server";

// Fetch all attendance record of a specific event
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id: eventId } = await params;

  try {
    const recordsWithStudent: any = await prisma.record.findMany({
      where: { eventId: eventId },
      select: {
        eventId: true,
        id: true,
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

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}
