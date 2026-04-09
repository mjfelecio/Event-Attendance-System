import { NextResponse } from "next/server";
import { prisma } from "@/globals/libs/prisma";
import { StudentAttendanceRecord } from "@/globals/types/students";
import { err, ok } from "@/globals/utils/api";
import { fullName } from "@/globals/utils/formatting";
import { assertEventVisibility, requireAuth } from "@/globals/utils/auth";
import { respondWithError } from "@/globals/utils/httpError";

export async function GET(
  _req: Request,
  { params }: { params: { eventId: string } },
) {
  try {
    const user = await requireAuth();
    const { eventId } = await params;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { includedGroups: true },
    });

    if (!event) {
      return NextResponse.json(err("No event found"));
    }

    assertEventVisibility(event, user);

    // Fetch records and include the student relations
    const recordsWithStudent = await prisma.record.findMany({
      where: { eventId },
      include: {
        student: {
          include: { groups: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Map to StudentAttendanceRecord type
    const records: StudentAttendanceRecord[] = recordsWithStudent.map((r) => {
      const s = r.student;

      return {
        id: r.id,
        eventId: r.eventId,
        studentId: r.studentId,
        fullName: fullName(s.firstName, s.middleName || "", s.lastName),
        schoolLevel: s.schoolLevel,
        section: s.groups.find((g) => g.category === "SECTION")?.slug ?? "",
        timein: r.timein ? r.timein.toISOString() : null,
        timeout: r.timeout ? r.timeout.toISOString() : null,
      };
    });

    return NextResponse.json(ok(records));
  } catch (error) {
    return respondWithError(error);
  }
}
