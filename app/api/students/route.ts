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

    // Resolve group slugs to IDs
    const groupSlugs = [
      validatedData.section,
      validatedData.house,
      validatedData.department,
      validatedData.program,
      validatedData.strand,
    ].filter(Boolean) as string[];

    const groups = await prisma.group.findMany({
      where: { slug: { in: groupSlugs } },
      select: { id: true },
    });

    const groupConnectIds = groups.map((g) => ({ id: g.id }));

    // We use the student's ID (the 11-character string) as the unique identifier
    const student = await prisma.student.upsert({
      where: { id: validatedData.id },
      update: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        middleName: validatedData.middleName || null,
        schoolLevel: validatedData.schoolLevel,
        yearLevel: validatedData.yearLevel,
        groups: {
          set: groupConnectIds, // Replaces old groups with new ones
        },
      },
      create: {
        id: validatedData.id,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        middleName: validatedData.middleName || null,
        schoolLevel: validatedData.schoolLevel,
        yearLevel: validatedData.yearLevel,
        groups: {
          connect: groupConnectIds,
        },
      },
      include: {
        groups: true,
      },
    });

    return NextResponse.json(ok(student), { status: 200 });
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
