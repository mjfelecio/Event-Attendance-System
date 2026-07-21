import { NextResponse } from "next/server";
import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { requireAuth } from "@/globals/utils/auth";
import { studentSchema } from "@/globals/schemas/studentSchema";
import { z } from "zod";
import { respondWithError } from "@/globals/utils/httpError";

const bulkSchema = z.array(studentSchema);

export async function POST(request: Request) {
  try {
    // Bulk roster upsert is a privileged write; require an authenticated user.
    await requireAuth();
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

    // Fetch all relevant groups with their category, so each slug can be
    // validated against the field that referenced it.
    const foundGroups = await prisma.group.findMany({
      where: { slug: { in: allSlugs } },
      select: { id: true, slug: true, category: true },
    });

    // Create a lookup map for speed: slug -> { id, category }
    const groupMap = new Map(foundGroups.map((g) => [g.slug, g]));

    // Reject the whole batch if any referenced group slug is unknown, instead
    // of silently dropping it and importing a student missing its groups.
    const unknownSlugs = allSlugs.filter((slug) => !groupMap.has(slug));
    if (unknownSlugs.length > 0) {
      return NextResponse.json(
        err(
          `Unknown group(s): ${unknownSlugs.join(", ")}. Fix the file and re-import.`,
          "UNKNOWN_GROUPS",
        ),
        { status: 400 },
      );
    }

    // Each column must reference a group of the matching category, so a HOUSE
    // slug can't be smuggled into the section column (leaving the student with
    // no real section while the batch still "succeeds").
    const FIELD_CATEGORY = {
      section: "SECTION",
      house: "HOUSE",
      department: "DEPARTMENT",
      program: "PROGRAM",
      strand: "STRAND",
    } as const;

    const mismatches: string[] = [];
    for (const s of students) {
      for (const [field, expected] of Object.entries(FIELD_CATEGORY)) {
        const slug = (s as Record<string, string | null | undefined>)[field];
        if (!slug) continue;
        const group = groupMap.get(slug);
        if (group && group.category !== expected) {
          mismatches.push(
            `"${slug}" is a ${group.category.toLowerCase()}, not a ${expected.toLowerCase()} (column "${field}")`,
          );
        }
      }
    }

    if (mismatches.length > 0) {
      return NextResponse.json(
        err(
          `Group category mismatch: ${Array.from(new Set(mismatches)).join("; ")}.`,
          "GROUP_CATEGORY_MISMATCH",
        ),
        { status: 400 },
      );
    }

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
          .map((slug) => groupMap.get(slug as string)?.id)
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
    return respondWithError(error);
  }
}
