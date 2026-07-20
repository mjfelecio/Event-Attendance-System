import { NextResponse } from "next/server";

import { prisma } from "@/globals/libs/prisma";
import { ok } from "@/globals/utils/api";
import { requireAuth } from "@/globals/utils/auth";
import { respondWithError } from "@/globals/utils/httpError";

// Roster category counts computed in the database, so the landing page's
// stat cards no longer download the entire student table just to count it.
export async function GET() {
  try {
    await requireAuth();

    const [all, college, shs, house] = await Promise.all([
      prisma.student.count(),
      prisma.student.count({ where: { schoolLevel: "COLLEGE" } }),
      prisma.student.count({ where: { schoolLevel: "SHS" } }),
      prisma.student.count({ where: { house: { not: null } } }),
    ]);

    return NextResponse.json(ok({ all, college, shs, house }), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
