import { NextResponse } from "next/server";

import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { assertEventVisibility, requireAuth } from "@/globals/utils/auth";
import {
  REPORT_EVENT_INCLUDE,
  buildEventReport,
} from "@/globals/utils/eventReport";
import { respondWithError } from "@/globals/utils/httpError";

/**
 * The full on-screen report for one event.
 *
 * Superset of `GET /api/events/[eventId]/stats` and
 * `GET /api/events/[eventId]/records?includeAbsent=true`, which are deliberately
 * left untouched — the live attendance screen polls them, and that is the one
 * screen operated under time pressure.
 *
 * @see globals/utils/eventReport.ts
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const user = await requireAuth();
    const { eventId } = await params;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: REPORT_EVENT_INCLUDE,
    });

    if (!event) {
      return NextResponse.json(err("Event not found."), { status: 404 });
    }

    assertEventVisibility(event, user);

    return NextResponse.json(ok(await buildEventReport(event)), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
