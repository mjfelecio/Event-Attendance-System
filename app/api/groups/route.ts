import { NextRequest, NextResponse } from "next/server";
import { SchoolLevel, YearLevel } from "@prisma/client";
import { prisma } from "@/globals/libs/prisma";
import { respondWithError } from "@/globals/utils/httpError";
import { ok } from "@/globals/utils/api";

/**
 * GET /api/groups
 * Fetches all available groups and flattens them into a Record<Category, Option[]>
 * used for dynamic filtering and form selection.
 */
export async function GET(_req: NextRequest) {
  try {
    // Fetch all groups from the database
    const groups = await prisma.group.findMany({
      orderBy: { name: "asc" },
    });

    // Transform groups into categorized Option arrays
    const categorizedOptions = groups.reduce((acc, group) => {
      const category = group.category;
      
      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push({
        label: group.name,
        value: group.slug,
      });

      return acc;
    }, {} as Record<string, { label: string; value: string }[]>);

    // Manually add enum options
    categorizedOptions["SCHOOL_LEVEL"] = Object.values(SchoolLevel).map((level) => ({
      label: level === "SHS" ? "Senior High School" : "College",
      value: level,
    }));

		categorizedOptions["YEAR_LEVEL"] = Object.values(YearLevel).map((level) => ({
      label: level,
      value: level,
    }));

    return NextResponse.json(ok(categorizedOptions), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}