import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/globals/libs/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { err, ok } from "@/globals/utils/api";
import { requireAuth } from "@/globals/utils/auth";
import { buildStudentQuery } from "@/globals/utils/queryBuilder";
import { studentSchema } from "@/globals/schemas/studentSchema";
import { respondWithError } from "@/globals/utils/httpError";
import { flattenStudentGroups } from "@/globals/utils/students";
import { buildEventStudentFilter } from "@/globals/utils/buildEventStudentFilter";

export async function POST(request: NextRequest) {
  try {
    // Policy: any active, authenticated user may manage the student roster
    // (create/edit/delete) - intentionally broader than event-deletion and
    // organizer-approval, which require ownership/admin. requireAuth already
    // enforces active status.
    await requireAuth();
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
    // A repeat student ID is a user error, not a 500.
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

const querySchema = z.object({
  // Single fetch params
  studentId: z.string().optional(),
  eventId: z.string().optional(),

  // Bulk filter params
  category: z.enum(["SHS", "COLLEGE", "HOUSE", "ALL"]).optional(),
  department: z.string().optional(),
  program: z.string().optional(),
  strand: z.string().optional(),
  house: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const searchParams = new URL(request.url).searchParams;

  try {
    // Roster reads carry student PII, so they are authenticated too.
    await requireAuth();
    const result = querySchema.parse(Object.fromEntries(searchParams));

    const { studentId, eventId, ...filters } = result;

    // Single Student Fetch (Scoped by Event or Absolute)
    if (studentId) {
      let eventFilter = {};

      if (eventId) {
        const event = await prisma.event.findUnique({
          where: { id: eventId },
          include: { includedGroups: true },
        });

        if (!event) {
          return NextResponse.json(err("Event not found"), { status: 404 });
        }
        eventFilter = buildEventStudentFilter(event);
      }

      const rawStudent = await prisma.student.findFirst({
        where: {
          id: studentId,
          ...eventFilter,
        },
        include: { groups: true },
      });

      if (!rawStudent) {
        return NextResponse.json(err("Student not found or ineligible"), {
          status: 404,
        });
      }

      return NextResponse.json(ok(flattenStudentGroups(rawStudent)));
    }

    // Bulk Student Fetch (List View)
    const where = buildStudentQuery(filters);

    const rawStudents = await prisma.student.findMany({
      where,
      include: { groups: true },
      orderBy: { lastName: "asc" },
    });

    const students = rawStudents.map(flattenStudentGroups);
    return NextResponse.json(ok(students));
  } catch (error) {
    return respondWithError(error);
  }
}
