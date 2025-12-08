import { prisma } from "@/globals/libs/prisma";
import { buildEventStudentFilter } from "@/globals/utils/buildEventStudentFilter";
import { NextRequest, NextResponse } from "next/server";

// Fetch a single student that is included in the event
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; studentId: string } }
) {
  const { id, studentId } = await params;

  try {
    const event = await prisma.event.findUnique({ where: { id: id } });

    if (!event) {
      return NextResponse.json(
        { error: "Event doesnt exist" },
        { status: 404 }
      );
    }

    const studentFilter = buildEventStudentFilter(event);

    const student = await prisma.student.findFirst({
      where: { ...studentFilter, id: studentId },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student does not exist or is not included in the event" },
        { status: 404 }
      );
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
