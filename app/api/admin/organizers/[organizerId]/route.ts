import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { requireAuth, requireRole } from "@/globals/utils/auth";
import { respondWithError } from "@/globals/utils/httpError";

const decisionSchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  reason: z.string().min(1).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { organizerId: string } }
) {
  try {
    const user = await requireAuth();
    requireRole(user, "ADMIN");

    const { organizerId } = await params;
    const { action, reason } = decisionSchema.parse(await req.json());

    const organizer = await prisma.user.findUnique({
      where: { id: organizerId },
      select: {
        id: true,
        role: true,
        status: true,
      },
    });

    if (!organizer || organizer.role !== "ORGANIZER") {
      return NextResponse.json(err("Organizer not found."), { status: 404 });
    }

    if (organizer.status !== "PENDING") {
      return NextResponse.json(
        err("Only pending organizers can be reviewed."),
        { status: 409 }
      );
    }

    if (action === "APPROVE") {
      const updated = await prisma.user.update({
        where: { id: organizerId },
        data: {
          status: "ACTIVE",
          rejectionReason: null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          rejectionReason: true,
        },
      });

      return NextResponse.json(ok(updated), { status: 200 });
    }

    if (!reason) {
      return NextResponse.json(err("Rejection reason is required."), {
        status: 400,
      });
    }

    const updated = await prisma.user.update({
      where: { id: organizerId },
      data: {
        status: "REJECTED",
        rejectionReason: reason,
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        rejectionReason: true,
      },
    });

    return NextResponse.json(ok(updated), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
