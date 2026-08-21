import { prisma } from "@/globals/libs/prisma";
import { ok } from "@/globals/utils/api";
import { requireAuth } from "@/globals/utils/auth";
import { respondWithError } from "@/globals/utils/httpError";
import { NextResponse } from "next/server";

/**
 * GET /api/stats/student-counts
 * Returns the unique student count for each main category.
 */
export async function GET() {
  try {
    await requireAuth();

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
  } catch (error) {
    return respondWithError(error);
  }
}
