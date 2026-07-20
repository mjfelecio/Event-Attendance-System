import { NextResponse } from "next/server";

import { prisma } from "@/globals/libs/prisma";
import { StudentAttendanceRecord } from "@/globals/types/students";
import { err, ok } from "@/globals/utils/api";
import { fullName } from "@/globals/utils/formatting";
import { assertEventVisibility, requireAuth } from "@/globals/utils/auth";
import { buildEventStudentFilter } from "@/globals/utils/buildEventStudentFilter";
import { respondWithError } from "@/globals/utils/httpError";

// Fetch attendance for an event.
// - default: students who have a record (present rows), for the live table.
// - ?includeAbsent=true: every currently-eligible student with present/absent
//   status, so a report's rows and its present/absent totals always agree
//   (both derived from the same current-eligibility set).
export async function GET(
  req: Request,
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

    const includeAbsent =
      new URL(req.url).searchParams.get("includeAbsent") === "true";

    // Scope records to currently-eligible students so the present rows match
    // the header/summary stats (which also count present among current
    // eligibility). A student who became inactive or left the event's group
    // drops from both, keeping counts and visible rows consistent.
    const recordsWithStudent = await prisma.record.findMany({
      where: { eventId, student: buildEventStudentFilter(event) },
      select: {
        id: true,
        eventId: true,
        studentId: true,
        timein: true,
        timeout: true,
        student: {
          select: {
            firstName: true,
            middleName: true,
            lastName: true,
            schoolLevel: true,
            section: true,
          },
        },
      },
    });

    type RecordWithStudent = (typeof recordsWithStudent)[number];

    if (!includeAbsent) {
      const records: StudentAttendanceRecord[] = recordsWithStudent.map(
        (r: RecordWithStudent) => ({
          id: r.id,
          eventId: r.eventId,
          studentId: r.studentId,
          fullName: fullName(
            r.student.firstName,
            r.student.middleName || "",
            r.student.lastName,
          ),
          schoolLevel: r.student.schoolLevel,
          section: r.student.section,
          timein: r.timein ? new Date(r.timein).toString() : null,
          timeout: r.timeout ? new Date(r.timeout).toString() : null,
          status: "present",
        }),
      );

      return NextResponse.json(ok(records), { status: 200 });
    }

    // Report view: start from every currently-eligible student and mark each
    // present (has record) or absent (none). Records for students who are no
    // longer eligible are intentionally excluded so rows match the stats.
    const recordByStudent = new Map(
      recordsWithStudent.map((r) => [r.studentId, r] as const),
    );

    const eligibleStudents = await prisma.student.findMany({
      where: buildEventStudentFilter(event),
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        schoolLevel: true,
        section: true,
      },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    });

    const rows: StudentAttendanceRecord[] = eligibleStudents.map((s) => {
      const record = recordByStudent.get(s.id);
      return {
        id: record?.id ?? s.id,
        eventId,
        studentId: s.id,
        fullName: fullName(s.firstName, s.middleName || "", s.lastName),
        schoolLevel: s.schoolLevel,
        section: s.section,
        timein: record?.timein ? new Date(record.timein).toString() : null,
        timeout: record?.timeout ? new Date(record.timeout).toString() : null,
        status: record ? "present" : "absent",
      };
    });

    return NextResponse.json(ok(rows), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
