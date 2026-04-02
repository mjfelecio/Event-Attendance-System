import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { handlePrismaError } from "@/globals/utils/prismaError";
import { EventCategory } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * GET /api/groups/[category]
 * Fetches all groups that match a specific EventCategory.
 */
export async function GET(
  request: Request,
  { params }: { params: { category: EventCategory } },
) {
  const { category } = await params;
  try {
    if (!Object.values(EventCategory).includes(category)) {
      return NextResponse.json(
        err("Invalid category provided", "INVALID_CATEGORY"),
        {
          status: 400,
        },
      );
    }

    const groups = await prisma.group.findMany({
      where: {
        category: category,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(ok(groups), { status: 200 });
  } catch (e) {
    const { status, message } = handlePrismaError(e);

    console.error("[GROUPS_GET_BY_CATEGORY]", message);
    return NextResponse.json(err(message), { status });
  }
}
