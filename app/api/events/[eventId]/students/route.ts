import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { buildEventStudentFilter } from "@/globals/utils/buildEventStudentFilter";
import { handlePrismaError } from "@/globals/utils/prismaError";
import { NextRequest, NextResponse } from "next/server";

// Fetch all students of this event
export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const { eventId } = await params;

  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      return NextResponse.json(err("Event not found"), { status: 404 });
    }

    const students = await prisma.student.findMany({
      where: buildEventStudentFilter(event),
    });

    return NextResponse.json(ok(students), { status: 200 });
  } catch (e) {
    const { status, message } = handlePrismaError(e);
    return NextResponse.json(err(message), { status });
  }
}
