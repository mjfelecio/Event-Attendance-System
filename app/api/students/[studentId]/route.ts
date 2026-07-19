import { NextResponse } from "next/server";
import { prisma } from "@/globals/libs/prisma";
import {
  mapStudentToRow,
  mapStudentToSource,
  slugify,
} from "@/features/manage-list/utils/mapStudentToRow";
import { err, ok } from "@/globals/utils/api";
import { requireAuth } from "@/globals/utils/auth";
import { respondWithError } from "@/globals/utils/httpError";
import { studentUpdateSchema } from "@/features/manage-list/utils/studentSchemas";

const createSlugPayload = (data: { department?: string; house?: string }) => {
  const departmentSlug = data.department
    ? slugify(data.department) ?? null
    : null;
  const houseSlug = data.house ? slugify(data.house) ?? null : null;
  return { departmentSlug, houseSlug };
};

// Fetching a single student by id
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    await requireAuth();
    const { studentId } = await params;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json(err("Student not found."), { status: 404 });
    }

    return NextResponse.json(ok(student), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    await requireAuth();
    const { studentId } = await params;

    const payload = await request.json();
    const data = studentUpdateSchema.parse({ ...payload, id: studentId });

    const isCollege = data.schoolLevel === "COLLEGE";
    const normalizedDepartment = isCollege ? data.department ?? null : null;
    const normalizedShsStrand =
      data.schoolLevel === "SHS" ? data.shsStrand ?? null : null;
    const normalizedCollegeProgram = isCollege
      ? data.collegeProgram ?? null
      : null;
    const { departmentSlug, houseSlug } = createSlugPayload({
      department: normalizedDepartment ?? undefined,
      house: data.house ?? undefined,
    });

    const student = await prisma.student.update({
      where: { id: studentId },
      data: {
        lastName: data.lastName,
        firstName: data.firstName,
        middleName: data.middleName,
        schoolLevel: data.schoolLevel,
        shsStrand: normalizedShsStrand,
        collegeProgram: normalizedCollegeProgram,
        section: data.section,
        yearLevel: data.yearLevel,
        status: data.status,
        contactNumber: data.contactNumber,
        department: normalizedDepartment,
        departmentSlug,
        house: data.house,
        houseSlug,
      },
    });

    const studentRow = mapStudentToRow(
      mapStudentToSource({
        ...student,
        name: `${student.firstName} ${student.lastName}`.trim(),
      })
    );

    return NextResponse.json(ok({ student: studentRow }), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    await requireAuth();
    const { studentId } = await params;

    await prisma.student.delete({ where: { id: studentId } });
    return NextResponse.json(ok(null), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
