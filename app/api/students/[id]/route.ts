import { NextResponse } from "next/server";
import { prisma } from "@/globals/libs/prisma";
import { flattenStudentGroups } from "@/globals/utils/students";
import { respondWithError } from "@/globals/utils/httpError";

// Fetching a single student by id
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;

  try {
    const rawStudent = await prisma.student.findUnique({
      where: {
        id,
      },
      include: { groups: true },
    });

    if (!rawStudent) {
      throw Error("Student not found");
    }

    const student = flattenStudentGroups(rawStudent);

    return NextResponse.json(student);
  } catch (error) {
    respondWithError(error);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;

  try {
    await prisma.student.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    respondWithError(error);
  }
}
