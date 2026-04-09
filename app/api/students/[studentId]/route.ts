import { NextResponse } from "next/server";
import { prisma } from "@/globals/libs/prisma";
import { Prisma } from "@prisma/client";
import { buildEventStudentFilter } from "@/globals/utils/buildEventStudentFilter";

// Fetching a single student by id
export async function GET(
  req: Request,
  { params }: { params: { studentId: string; eventId: string } }
) {
  const { studentId, eventId } = await params;

  try {
    let student;
    let event;

    if (eventId) {
      event = await prisma.event.findUnique({ where: { id: eventId } });
    } else {
      event = undefined;
    }

    if (event) {
      student = await prisma.student.findFirst({
        where: buildEventStudentFilter(event),
      });
    } else {
      student = await prisma.student.findUnique({
        where: {
          id: studentId,
        },
      });
    }

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { studentId: string } }
) {
  const { studentId } = params;

  try {
    await prisma.student.delete({ where: { id: studentId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Student not found." },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { message: "Failed to delete student." },
      { status: 500 }
    );
  }
}
