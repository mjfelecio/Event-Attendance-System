import { NextResponse } from "next/server";

import { prisma } from "@/globals/libs/prisma";
import { ok } from "@/globals/utils/api";
import { requireAuth } from "@/globals/utils/auth";
import { respondWithError } from "@/globals/utils/httpError";

// Distinct section names that exist on students, so the event drawer's SECTION
// picker doesn't download the whole roster just to derive them.
export async function GET() {
  try {
    await requireAuth();

    const rows = await prisma.student.findMany({
      distinct: ["section"],
      select: { section: true },
      orderBy: { section: "asc" },
    });

    return NextResponse.json(
      ok(rows.map((r) => r.section)),
      { status: 200 }
    );
  } catch (error) {
    return respondWithError(error);
  }
}
