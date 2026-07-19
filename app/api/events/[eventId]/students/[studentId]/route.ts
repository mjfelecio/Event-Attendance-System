import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { assertEventVisibility, requireAuth } from "@/globals/utils/auth";
import { buildEventStudentFilter } from "@/globals/utils/buildEventStudentFilter";
import { respondWithError } from "@/globals/utils/httpError";
import { NextRequest, NextResponse } from "next/server";

// Fetch a single student that is included in the event
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string; studentId: string }> }
) {
  try {
    const user = await requireAuth();
    const { eventId, studentId } = await params;

    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      return NextResponse.json(err("Event doesnt exist"), { status: 404 });
    }

    assertEventVisibility(event, user);

    const studentFilter = buildEventStudentFilter(event);

    const student = await prisma.student.findFirst({
      where: { ...studentFilter, id: studentId },
    });

    if (!student) {
      return NextResponse.json(
        err("Student does not exist or is not included in the event"),
        { status: 404 }
      );
    }

    return NextResponse.json(ok(student), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
