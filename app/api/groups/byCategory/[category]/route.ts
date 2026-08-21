import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { requireAuth } from "@/globals/utils/auth";
import { respondWithError } from "@/globals/utils/httpError";
import { EventCategory } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * GET /api/groups/[category]
 * Fetches all groups that match a specific EventCategory.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> },
) {
  const { category } = await params;
  try {
    await requireAuth();

    if (!Object.values(EventCategory).includes(category as EventCategory)) {
      return NextResponse.json(
        err("Invalid category provided", "INVALID_CATEGORY"),
        {
          status: 400,
        },
      );
    }

    const groups = await prisma.group.findMany({
      where: {
        category: category as EventCategory,
      },
      select: {
        id: true,
        name: true,
        // The selection boards navigate by slug; the event drawer uses the id.
        slug: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(ok(groups), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
