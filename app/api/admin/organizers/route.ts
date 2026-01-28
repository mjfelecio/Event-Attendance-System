import { NextResponse } from "next/server";

import { prisma } from "@/globals/libs/prisma";
import { ok } from "@/globals/utils/api";
import { requireAuth, requireRole } from "@/globals/utils/auth";
import { respondWithError } from "@/globals/utils/httpError";

export async function GET() {
  try {
    const user = await requireAuth();
    requireRole(user, "ADMIN");

    const organizers = await prisma.user.findMany({
      where: { role: "ORGANIZER", status: "PENDING" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        rejectionReason: true,
        createdAt: true,
      },
    });

    return NextResponse.json(ok(organizers), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
