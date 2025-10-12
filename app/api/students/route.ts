import { NextResponse } from "next/server";
import { prisma } from "@/globals/libs/prisma";
import { mapStudentToRow, mapStudentToSource, slugify } from "@/features/manage-list/utils/mapStudentToRow";
import { Prisma, SchoolLevel, StudentStatus, YearLevel } from "@prisma/client";
import { z } from "zod";

const createStudentSchema = z.object({
  id: z.string().length(11).regex(/^\d+$/),
  lastName: z.string().min(1),
  firstName: z.string().min(1),
  middleName: z.string().optional().nullable(),
  schoolLevel: z.nativeEnum(SchoolLevel),
  shsStrand: z.string().optional().nullable(),
  collegeProgram: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  house: z.string().optional().nullable(),
  section: z.string().min(1),
  yearLevel: z.nativeEnum(YearLevel),
  status: z.nativeEnum(StudentStatus).optional(),
  contactNumber: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = createStudentSchema.parse(payload);

    if (data.schoolLevel === SchoolLevel.SHS && !data.shsStrand) {
      return NextResponse.json(
        { message: "SHS students require an SHS strand." },
        { status: 400 }
      );
    }

    if (data.schoolLevel === SchoolLevel.COLLEGE && !data.collegeProgram) {
      return NextResponse.json(
        { message: "College students require a college program." },
        { status: 400 }
      );
    }

    const departmentSlug = data.department ? slugify(data.department) ?? null : null;
    const houseSlug = data.house ? slugify(data.house) ?? null : null;

    const student = await prisma.student.create({
      data: {
        id: data.id,
        lastName: data.lastName,
        firstName: data.firstName,
        middleName: data.middleName ?? null,
        schoolLevel: data.schoolLevel,
        shsStrand: data.schoolLevel === SchoolLevel.SHS ? data.shsStrand ?? null : null,
        collegeProgram: data.schoolLevel === SchoolLevel.COLLEGE ? data.collegeProgram ?? null : null,
        section: data.section,
        yearLevel: data.yearLevel,
        status: data.status ?? StudentStatus.ACTIVE,
        contactNumber: data.contactNumber ?? null,
        department: data.department ?? null,
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

    return NextResponse.json({ student: studentRow }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid student data.", issues: error.flatten() },
        { status: 400 }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { message: "A student with that ID already exists." },
          { status: 409 }
        );
      }
    }

    console.error("Failed to create student", error);
    return NextResponse.json(
      { message: "Failed to create student." },
      { status: 500 }
    );
  }
}

// Fetch all students
export async function GET() {
  try {
    const students = await prisma.student.findMany();

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' }, 
      { status: 500 }
    );
  }
}
