import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { buildEventStudentFilter } from "@/globals/utils/buildEventStudentFilter";
import { assertEventVisibility, requireAuth } from "@/globals/utils/auth";
import { respondWithError } from "@/globals/utils/httpError";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const user = await requireAuth();
    const { eventId } = await params;

    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      return NextResponse.json(err("Event not found."), { status: 404 });
    }

    assertEventVisibility(event, user);

    // Eligible students based on event criteria
    const eligibleFilter = buildEventStudentFilter(event);
    const eligibleStudentsCount = await prisma.student.count({
      where: eligibleFilter,
    });

    // Students who actually attended, counted only among the currently
    // eligible ones - otherwise a student who became inactive (or an event
    // whose groups changed) could push attendance above 100%.
    const presentStudentsCount = await prisma.record.count({
      where: {
        eventId,
        student: eligibleFilter,
      },
    });

    const absentStudentsCount = Math.max(
      eligibleStudentsCount - presentStudentsCount,
      0
    );

    return NextResponse.json(
      ok({
        eligible: eligibleStudentsCount,
        present: presentStudentsCount,
        absent: absentStudentsCount,
      }),
      { status: 200 },
    );
  } catch (error) {
    return respondWithError(error);
  }
}
