import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import {
  assertEventOwnership,
  assertEventStatus,
  requireAuth,
} from "@/globals/utils/auth";
import { respondWithError } from "@/globals/utils/httpError";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await requireAuth();
    const { eventId }  = await params;

    const existing = await prisma.event.findUnique({
      where: { id: eventId },
    });


    if (!existing) {
      return NextResponse.json(err("No event found"), { status: 404 });
    }

    assertEventOwnership(existing, user);
    assertEventStatus(existing, "APPROVED");

    // Toggle: scans switch between recording time-in and time-out.
    const updated = await prisma.event.update({
      where: { id: eventId },
      data: {
        isTimeout: !existing.isTimeout,
      },
    });

    return NextResponse.json(ok(updated), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
