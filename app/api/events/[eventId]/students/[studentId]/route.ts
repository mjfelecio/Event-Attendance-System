import { prisma } from "@/globals/libs/prisma";
import { err } from "@/globals/utils/api";
import { buildEventStudentFilter } from "@/globals/utils/buildEventStudentFilter";
import { handlePrismaError } from "@/globals/utils/prismaError";
import { NextRequest, NextResponse } from "next/server";

// Fetch a single student that is included in the event
export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string; studentId: string } }
) {
  const { eventId, studentId } = await params;

  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      return NextResponse.json(err("Event doesnt exist"), { status: 404 });
    }

    const studentFilter = buildEventStudentFilter(event);

    const student = await prisma.student.findFirst({
      where: { ...studentFilter, id: studentId },
    });

    if (!student) {
      return NextResponse.json(
        err("Student does not exist or is not included in the event"),
        { status: 404 }
      );
    }

    return NextResponse.json(student);
  } catch (e) {
    const { status, message } = handlePrismaError(e);
    return NextResponse.json(err(message), { status });
  }
}
