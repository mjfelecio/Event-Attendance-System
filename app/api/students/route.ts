import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/globals/libs/prisma";
import { z } from "zod";
import { err, ok } from "@/globals/utils/api";
import {
  buildStudentQuery,
  transformStudent,
} from "@/globals/utils/queryBuilder";
import { studentSchema } from "@/globals/schemas/studentSchema";
import { respondWithError } from "@/globals/utils/httpError";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const validatedData = studentSchema.parse(payload);

    // Collect all slugs from the flat form data
    const groupSlugs = [
      validatedData.section,
      validatedData.house,
      validatedData.department,
      validatedData.program,
      validatedData.strand,
    ].filter(Boolean) as string[];

    // Find the actual Group records to get their IDs
    // This ensures we only connect to groups that actually exist in the DB
    const groups = await prisma.group.findMany({
      where: {
        slug: { in: groupSlugs },
      },
      select: { id: true },
    });

    // Create the student and connect the groups
    const student = await prisma.student.create({
      data: {
        id: validatedData.id,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        middleName: validatedData.middleName || null,
        schoolLevel: validatedData.schoolLevel,
        yearLevel: validatedData.yearLevel,
        groups: {
          connect: groups.map((g) => ({ id: g.id })),
        },
      },
      include: {
        groups: true,
      },
    });

    return NextResponse.json(ok(student), { status: 201 });
  } catch (error) {
    return respondWithError(error);
  }
}

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
      orderBy: { lastName: "asc" },
    });

    const students = rawStudents.map(transformStudent);

    return NextResponse.json(ok(students), { status: 200 });
  } catch (error) {
    respondWithError(error)
  }
}
