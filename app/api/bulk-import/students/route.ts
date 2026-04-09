import { NextResponse } from "next/server";
import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { studentSchema } from "@/globals/schemas/studentSchema";
import { z } from "zod";
import { respondWithError } from "@/globals/utils/httpError";

const bulkSchema = z.array(studentSchema);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = bulkSchema.safeParse(body);

    if (!parseResult.success) {
      console.warn(
        "Failed parsing imported data: ",
        z.treeifyError(parseResult.error),
      );
      return NextResponse.json(
        err("Invalid data format: \n" + parseResult.error.message),
        {
          status: 400,
        },
      );
    }

    const students = parseResult.data;

    // Collect all unique slugs across all students to resolve IDs in one go
    const allSlugs = Array.from(
      new Set(
        students.flatMap((s) =>
          [s.section, s.house, s.department, s.program, s.strand].filter(
            Boolean,
          ),
        ),
      ),
    ) as string[];

    // Fetch all relevant groups
    const foundGroups = await prisma.group.findMany({
      where: { slug: { in: allSlugs } },
      select: { id: true, slug: true },
    });

    // Create a lookup map for speed: slug -> id
    const groupMap = new Map(foundGroups.map((g) => [g.slug, g.id]));

    // Process the transaction
    const results = await prisma.$transaction(
      students.map((data) => {
        // Map data slugs to actual IDs found in our lookup
        const studentGroupIds = [
          data.section,
          data.house,
          data.department,
          data.program,
          data.strand,
        ]
          .filter(Boolean)
          .map((slug) => groupMap.get(slug as string))
          .filter(Boolean)
          .map((id) => ({ id }));

        return prisma.student.upsert({
          where: { id: data.id },
          update: {
            firstName: data.firstName,
            lastName: data.lastName,
            middleName: data.middleName || null,
            schoolLevel: data.schoolLevel,
            yearLevel: data.yearLevel,
            groups: {
              set: studentGroupIds, // Replace existing relationships
            },
          },
          create: {
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            middleName: data.middleName || null,
            schoolLevel: data.schoolLevel,
            yearLevel: data.yearLevel,
            groups: {
              connect: studentGroupIds,
            },
          },
        });
      }),
    );

    return NextResponse.json(
      ok({
        message: `Successfully processed ${results.length} records.`,
        count: results.length,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("BULK_IMPORT_ERROR", error);
    respondWithError(error);
  }
}
