import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/globals/libs/prisma";
import {
  mapStudentToRow,
  mapStudentToSource,
  slugify,
} from "@/features/manage-list/utils/mapStudentToRow";
import { z } from "zod";
import { err, ok } from "@/globals/utils/api";
import { studentCreateSchema } from "@/features/manage-list/utils/studentSchemas";
import { Student } from "@/globals/types/students";
import { buildStudentQuery, transformStudent } from "@/globals/utils/queryBuilder";
import { handlePrismaError } from "@/globals/utils/prismaError";

// const isCollegeYearLevel = (yearLevel: YearLevel) =>
//   yearLevel === YearLevel.YEAR_1 ||
//   yearLevel === YearLevel.YEAR_2 ||
//   yearLevel === YearLevel.YEAR_3 ||
//   yearLevel === YearLevel.YEAR_4;

// const isShsYearLevel = (yearLevel: YearLevel) =>
//   yearLevel === YearLevel.GRADE_11 || yearLevel === YearLevel.GRADE_12;

// export async function POST(request: Request) {
//   try {
//     const payload = await request.json();
//     const data = studentCreateSchema.parse({
//       ...payload,
//       status: payload?.status ?? StudentStatus.ACTIVE,
//     });

//     const isCollege = data.schoolLevel === SchoolLevel.COLLEGE;
//     const isShs = data.schoolLevel === SchoolLevel.SHS;

//     if (isShs && !data.shsStrand) {
//       return NextResponse.json(err("SHS students require an SHS strand."), {
//         status: 400,
//       });
//     }

//     if (isCollege && !data.collegeProgram) {
//       return NextResponse.json(
//         err("College students require a college program."),
//         { status: 400 }
//       );
//     }

//     if (isCollege && !data.department) {
//       return NextResponse.json(err("College students require a department."), {
//         status: 400,
//       });
//     }

//     if (isCollege && !isCollegeYearLevel(data.yearLevel)) {
//       return NextResponse.json(
//         err("College students must be from 1st to 4th year."),
//         { status: 400 }
//       );
//     }

//     if (isShs && !isShsYearLevel(data.yearLevel)) {
//       return NextResponse.json(
//         err("SHS students must be Grade 11 or Grade 12."),
//         { status: 400 }
//       );
//     }

//     const normalizedDepartment = isCollege ? data.department ?? null : null;
//     const normalizedShsStrand = isShs ? data.shsStrand ?? null : null;
//     const normalizedCollegeProgram = isCollege ? data.collegeProgram ?? null : null;

//     const departmentSlug = normalizedDepartment
//       ? slugify(normalizedDepartment) ?? null
//       : null;
//     const houseSlug = data.house ? slugify(data.house) ?? null : null;

//     const student = await prisma.student.create({
//       data: {
//         id: data.id,
//         lastName: data.lastName,
//         firstName: data.firstName,
//         middleName: data.middleName ?? null,
//         schoolLevel: data.schoolLevel,
//         shsStrand: normalizedShsStrand,
//         collegeProgram: normalizedCollegeProgram,
//         section: data.section,
//         yearLevel: data.yearLevel,
//         status: data.status ?? StudentStatus.ACTIVE,
//         department: normalizedDepartment,
//         departmentSlug,
//         house: data.house ?? null,
//         houseSlug,
//       },
//     });

//     const studentRow = mapStudentToRow(
//       mapStudentToSource({
//         ...student,
//         name: `${student.firstName} ${student.lastName}`.trim(),
//       })
//     );

//     return NextResponse.json(ok({ student: studentRow }), { status: 201 });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       // TODO: What is this issues object, I need to check how its used like
//       // Since this should conform to ok, err pattern for the NextResponse
//       // Like the other responses that I have modified
//       return NextResponse.json(
//         { message: "Invalid student data.", issues: error.flatten() },
//         { status: 400 }
//       );
//     }

//     if (error instanceof Prisma.PrismaClientKnownRequestError) {
//       if (error.code === "P2002") {
//         return NextResponse.json(
//           err("A student with that ID already exists.", "DUPLICATE"),
//           { status: 409 }
//         );
//       }
//     }

//     console.error("Failed to create student", error);
//     return NextResponse.json(err("Failed to create student."), { status: 500 });
//   }
// }

// NOTE: values must be the slug versions
const querySchema = z.object({
  category: z.enum(["SHS", "COLLEGE", "HOUSE", "ALL"]).optional(),

  department: z.string().optional(),
  program: z.string().optional(),
  strand: z.string().optional(),
  // HARDCODED FOR NOW
  house: z.enum(["azul", "vierrdy", "giallio", "cahel", "roxxo"]).optional(),
  // limit: 20
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const result = querySchema.safeParse(Object.fromEntries(searchParams));

  if (!result.success) {
    return NextResponse.json(err("Invalid parameters"), { status: 400 });
  }

  try {
    const where = buildStudentQuery(result.data);

    const rawStudents = await prisma.student.findMany({
      where,
      include: { groups: true },
      orderBy: { lastName: 'asc' }
    });

    const students = rawStudents.map(transformStudent)

    return NextResponse.json(ok(students), { status: 200 });
  } catch (error) {
    const { status, message } = handlePrismaError(error);
    return NextResponse.json(err(message), { status });
  }
}
