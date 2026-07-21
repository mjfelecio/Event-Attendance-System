import { NextResponse } from "next/server";
import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { requireAuth } from "@/globals/utils/auth";
import { studentSchema } from "@/globals/schemas/studentSchema";
import { z } from "zod";
import { respondWithError } from "@/globals/utils/httpError";
import { validateStudentGroupSlugs } from "@/globals/utils/studentGroups";

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

    // Validate + resolve every referenced group slug in one shot, using the
    // same shared validator the single-student endpoint uses: each slug must
    // exist and match its column's category, or the whole batch is rejected.
    const resolution = await validateStudentGroupSlugs(students);
    if (!resolution.ok) {
      return NextResponse.json(err(resolution.error, "INVALID_GROUPS"), {
        status: 400,
      });
    }
    const { slugToId } = resolution;

    // Process the transaction
    const results = await prisma.$transaction(
      students.map((data) => {
        // Map data slugs to actual IDs (all validated above).
        const studentGroupIds = [
          data.section,
          data.house,
          data.department,
          data.program,
          data.strand,
        ]
          .filter(Boolean)
          .map((slug) => slugToId.get(slug as string))
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
