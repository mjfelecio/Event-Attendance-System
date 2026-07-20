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

    // Bounded, server-side name search for the attendance lookup so the client
    // never downloads every eligible student. `limit` caps the result set.
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 50, 1),
      200
    );

    const where = buildEventStudentFilter(event);
    if (q) {
      // SQLite LIKE is case-insensitive for ASCII, so `contains` matches
      // regardless of case without the (unsupported) `mode: "insensitive"`.
      where.OR = [
        { firstName: { contains: q } },
        { middleName: { contains: q } },
        { lastName: { contains: q } },
        { id: { contains: q } },
      ];
    }

    const students = await prisma.student.findMany({
      where,
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      take: limit,
    });

    return NextResponse.json(ok(students), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
