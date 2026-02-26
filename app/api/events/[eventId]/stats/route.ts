import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/globals/libs/prisma";
import { ok } from "@/globals/utils/api";
import { buildEventStudentFilter } from "@/globals/utils/buildEventStudentFilter";
import { assertEventVisibility, requireAuth } from "@/globals/utils/auth";
import { respondWithError } from "@/globals/utils/httpError";

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } },
) {
  try {
    const user = await requireAuth();
    const { eventId } = await params;

    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      return NextResponse.json(ok(null), { status: 404 });
    }

    assertEventVisibility(event, user);

    // Eligible students based on event criteria
    const eligibleStudentsCount = await prisma.student.count({
      where: buildEventStudentFilter(event),
    });

    // Students who actually attended
    const presentStudentsCount = await prisma.record.count({
      where: {
        eventId,
      },
    });

    const absentStudentsCount = eligibleStudentsCount - presentStudentsCount;

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
