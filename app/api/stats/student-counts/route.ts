import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { handlePrismaError } from "@/globals/utils/prismaError";
import { NextResponse } from "next/server";

/**
 * GET /api/stats/student-counts
 * Returns the unique student count for each main category.
 */
export async function GET() {
  try {
    const [total, house, college, shs] = await Promise.all([
      prisma.student.count(),

      prisma.student.count({
        where: { groups: { some: { category: "HOUSE" } } },
      }),

      prisma.student.count({
        where: { schoolLevel: "COLLEGE" },
      }),

      prisma.student.count({
        where: { schoolLevel: "SHS" },
      }),
    ]);

    const stats = {
      ALL: total,
      HOUSE: house,
      COLLEGE: college,
      SHS: shs,
    };

    return NextResponse.json(ok(stats), { status: 200 });
  } catch (e) {
    const { status, message } = handlePrismaError(e);
    console.error("[STATS_GET_STUDENT_COUNTS]", message);
    return NextResponse.json(err(message), { status });
  }
}
