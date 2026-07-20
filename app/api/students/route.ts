import { NextResponse } from "next/server";
import { prisma } from "@/globals/libs/prisma";
import {
  mapStudentToRow,
  mapStudentToSource,
  slugify,
} from "@/features/manage-list/utils/mapStudentToRow";
import { Prisma, SchoolLevel, StudentStatus, YearLevel } from "@prisma/client";
import { departmentBySlug, programByCode } from "@/globals/constants/groups";
import { err, ok } from "@/globals/utils/api";
import { requireAuth } from "@/globals/utils/auth";
import { respondWithError } from "@/globals/utils/httpError";
import { studentCreateSchema } from "@/features/manage-list/utils/studentSchemas";

const isCollegeYearLevel = (yearLevel: YearLevel) =>
  yearLevel === YearLevel.YEAR_1 ||
  yearLevel === YearLevel.YEAR_2 ||
  yearLevel === YearLevel.YEAR_3 ||
  yearLevel === YearLevel.YEAR_4;

const isShsYearLevel = (yearLevel: YearLevel) =>
  yearLevel === YearLevel.GRADE_11 || yearLevel === YearLevel.GRADE_12;

export async function POST(request: Request) {
  try {
    await requireAuth();
    const payload = await request.json();
    const data = studentCreateSchema.parse({
      ...payload,
      status: payload?.status ?? StudentStatus.ACTIVE,
    });

    const isCollege = data.schoolLevel === SchoolLevel.COLLEGE;
    const isShs = data.schoolLevel === SchoolLevel.SHS;

    if (isShs && !data.shsStrand) {
      return NextResponse.json(err("SHS students require an SHS strand."), {
        status: 400,
      });
    }

    if (isCollege && !data.collegeProgram) {
      return NextResponse.json(
        err("College students require a college program."),
        { status: 400 }
      );
    }

    if (isCollege && !isCollegeYearLevel(data.yearLevel)) {
      return NextResponse.json(
        err("College students must be from 1st to 4th year."),
        { status: 400 }
      );
    }

    if (isShs && !isShsYearLevel(data.yearLevel)) {
      return NextResponse.json(
        err("SHS students must be Grade 11 or Grade 12."),
        { status: 400 }
      );
    }

    const normalizedShsStrand = isShs ? data.shsStrand ?? null : null;
    const normalizedCollegeProgram = isCollege ? data.collegeProgram ?? null : null;

    // Department is derived from the program, never taken from the client.
    // New programs without an assigned department yield null.
    const programDept = departmentBySlug(
      programByCode(normalizedCollegeProgram)?.departmentSlug
    );
    const normalizedDepartment = isCollege ? programDept?.name ?? null : null;
    const departmentSlug = isCollege ? programDept?.slug ?? null : null;
    const houseSlug = data.house ? slugify(data.house) ?? null : null;

    const student = await prisma.student.create({
      data: {
        id: data.id,
        lastName: data.lastName,
        firstName: data.firstName,
        middleName: data.middleName ?? null,
        schoolLevel: data.schoolLevel,
        shsStrand: normalizedShsStrand,
        collegeProgram: normalizedCollegeProgram,
        section: data.section,
        yearLevel: data.yearLevel,
        status: data.status ?? StudentStatus.ACTIVE,
        contactNumber: data.contactNumber ?? null,
        department: normalizedDepartment,
        departmentSlug,
        house: data.house ?? null,
        houseSlug,
      },
    });

    const studentRow = mapStudentToRow(
      mapStudentToSource({
        ...student,
        name: `${student.firstName} ${student.lastName}`.trim(),
      })
    );

    return NextResponse.json(ok({ student: studentRow }), { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        err("A student with that ID already exists.", "DUPLICATE"),
        { status: 409 }
      );
    }

    return respondWithError(error);
  }
}

// Fetch students. Supports optional `q` (name/id search) and `limit`; with
// no params it returns the full roster so existing full-list callers (stats,
// section derivation) keep working - a foundation for real pagination later.
export async function GET(req: Request) {
  try {
    await requireAuth();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() ?? "";

    // An absent limit intentionally returns the full roster (metadata callers).
    // A present-but-invalid limit is rejected rather than silently unbounded.
    const rawLimit = searchParams.get("limit");
    let take: number | undefined;
    if (rawLimit !== null) {
      const parsed = Number(rawLimit);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        return NextResponse.json(
          err("limit must be a positive integer."),
          { status: 400 }
        );
      }
      take = Math.min(parsed, 500);
    }

    const students = await prisma.student.findMany({
      where: q
        ? {
            OR: [
              { firstName: { contains: q } },
              { middleName: { contains: q } },
              { lastName: { contains: q } },
              { id: { contains: q } },
            ],
          }
        : undefined,
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      ...(take ? { take } : {}),
    });

    return NextResponse.json(ok(students));
  } catch (error) {
    return respondWithError(error);
  }
}
