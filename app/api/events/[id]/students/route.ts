import { prisma } from "@/globals/libs/prisma";
import { buildEventStudentFilter } from "@/globals/utils/buildEventStudentFilter";
import { NextRequest, NextResponse } from "next/server";

// Fetch all students of this event
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const students = await prisma.student.findMany({
      where: buildEventStudentFilter(event),
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
