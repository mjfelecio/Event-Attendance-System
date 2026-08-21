import { NextResponse } from "next/server";
import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { requireAuth } from "@/globals/utils/auth";
import { flattenStudentGroups } from "@/globals/utils/students";
import { respondWithError } from "@/globals/utils/httpError";

// Fetching a single student by id
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Student records are PII; reads require an authenticated, active user.
    await requireAuth();
    const { id } = await params;

    const rawStudent = await prisma.student.findUnique({
      where: { id },
      include: { groups: true },
    });

    if (!rawStudent) {
      return NextResponse.json(err("Student not found."), { status: 404 });
    }

    return NextResponse.json(ok(flattenStudentGroups(rawStudent)), {
      status: 200,
    });
  } catch (error) {
    return respondWithError(error);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Deleting a student is a roster mutation; gate it behind auth.
    await requireAuth();
    const { id } = await params;

    const attendanceCount = await prisma.record.count({
      where: { studentId: id },
    });

    if (attendanceCount > 0) {
      return NextResponse.json(
        err(
          "Cannot delete this student because attendance has already been recorded for them.",
          "STUDENT_HAS_RECORDS"
        ),
        { status: 409 }
      );
    }

    await prisma.student.delete({ where: { id } });
    return NextResponse.json(ok(null), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
