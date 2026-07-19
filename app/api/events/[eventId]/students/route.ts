import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { assertEventVisibility, requireAuth } from "@/globals/utils/auth";
import { buildEventStudentFilter } from "@/globals/utils/buildEventStudentFilter";
import { respondWithError } from "@/globals/utils/httpError";
import { NextRequest, NextResponse } from "next/server";

// Fetch all students of this event
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await requireAuth();
    const { eventId } = await params;

    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      return NextResponse.json(err("Event not found"), { status: 404 });
    }

    assertEventVisibility(event, user);

    const students = await prisma.student.findMany({
      where: buildEventStudentFilter(event),
    });

    return NextResponse.json(ok(students), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
