import { NextResponse } from "next/server";
import { 
  StudentStatus, 
  SchoolLevel, 
  YearLevel, 
  Prisma 
} from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/globals/libs/prisma";
import { slugify } from "@/features/manage-list/utils/mapStudentToRow";
import { err, ok } from "@/globals/utils/api";

const studentSchema = z.object({
  id: z.string().min(1, "ID is required"),
  lastName: z.string().min(1),
  firstName: z.string().min(1),
  middleName: z.string().optional().nullable(),
  section: z.string().min(1),
  yearLevel: z.nativeEnum(YearLevel),
  schoolLevel: z.nativeEnum(SchoolLevel),
  shsStrand: z.string().optional().nullable(),
  collegeProgram: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  house: z.string().optional().nullable(),
  status: z.nativeEnum(StudentStatus).default(StudentStatus.ACTIVE),
});

const bulkSchema = z.array(studentSchema);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = bulkSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { 
          message: "Invalid bulk data format.", 
          issues: z.treeifyError(parseResult.error) 
        },
        { status: 400 }
      );
    }

    const students = parseResult.data;

    const results = await prisma.$transaction(
      students.map((data) => {
        const isCollege = data.schoolLevel === SchoolLevel.COLLEGE;
        const isShs = data.schoolLevel === SchoolLevel.SHS;

        const normalizedDepartment = isCollege ? data.department ?? null : null;
        const departmentSlug = normalizedDepartment ? slugify(normalizedDepartment) : null;
        const houseSlug = data.house ? slugify(data.house) : null;

        return prisma.student.upsert({
          where: { id: data.id },
          update: {
            id: String(data.id),
            lastName: data.lastName,
            firstName: data.firstName,
            middleName: data.middleName,
            schoolLevel: data.schoolLevel,
            shsStrand: isShs ? data.shsStrand : null,
            collegeProgram: isCollege ? data.collegeProgram : null,
            section: data.section,
            yearLevel: data.yearLevel,
            status: data.status,
            department: normalizedDepartment,
            departmentSlug,
            house: data.house,
            houseSlug,
          },
          create: {
            id: String(data.id),
            lastName: data.lastName,
            firstName: data.firstName,
            middleName: data.middleName,
            schoolLevel: data.schoolLevel,
            shsStrand: isShs ? data.shsStrand : null,
            collegeProgram: isCollege ? data.collegeProgram : null,
            section: data.section,
            yearLevel: data.yearLevel,
            status: data.status,
            department: normalizedDepartment,
            departmentSlug,
            house: data.house,
            houseSlug,
          },
        });
      })
    );

    return NextResponse.json(ok({
      success: true,
      message: `Successfully processed ${results.length} records.`,
      count: results.length
    }), { status: 200 });

  } catch (error) {
    console.error("BULK_IMPORT_ERROR", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(err(`Database error: ${error.message}`, error.code), { status: 500 });
    }

    return NextResponse.json(err("Internal server error during bulk import."), { status: 500 });
  }
}