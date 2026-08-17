import "server-only";

import { prisma } from "@/globals/libs/prisma";
import {
  ARRIVAL_BUCKET_MINUTES,
  MAX_ARRIVAL_BUCKETS,
} from "@/globals/constants/attendance";
import type {
  ArrivalBucket,
  EventReport,
  ReportEvent,
  ReportRow,
  ReportTotals,
  SectionBreakdown,
} from "@/globals/types/reports";
import {
  attendanceRate,
  deriveOutcome,
  expectsTimeout as computeExpectsTimeout,
  hasNoTimeout,
} from "@/globals/utils/attendance";
import { buildEventStudentFilter } from "@/globals/utils/buildEventStudentFilter";
import { fullName } from "@/globals/utils/formatting";

/**
 * The single source of truth for one event's attendance report.
 *
 * Both consumers go through here:
 *
 * - `GET /api/reports/events/[eventId]` — the on-screen report
 * - `app/(print)/reports/events/[id]/print` — the printable attendance sheet
 *
 * That is the point. The print page used to query Prisma and recompute
 * eligibility and totals on its own, which `docs/conventions.md` called "the
 * single most important 'these two things must be changed together' relationship
 * in the codebase" — the screen and the paper could silently disagree. They now
 * cannot: there is one query, one set of totals, one verdict per student.
 *
 * @see globals/utils/attendance.ts — the derivation rules
 * @see docs/plans/reports-overhaul.md
 */

/** Section label used when a student belongs to no `SECTION` group. */
export const UNGROUPED_SECTION = "Ungrouped";

/**
 * The `include` that produces a {@link ReportEvent}.
 *
 * `createdBy` is narrowed to id + name rather than included wholesale: this
 * report is serialized to the client, and `include: { createdBy: true }` would
 * ship the organizer's **password hash** in the JSON. Use this at every call site.
 */
export const REPORT_EVENT_INCLUDE = {
  includedGroups: true,
  createdBy: { select: { id: true, name: true } },
} as const;

const BUCKET_MS = ARRIVAL_BUCKET_MINUTES * 60_000;

const floorToBucket = (date: Date): number =>
  Math.floor(date.getTime() / BUCKET_MS) * BUCKET_MS;

/**
 * Arrival counts per {@link ARRIVAL_BUCKET_MINUTES} window, in chronological order.
 *
 * Empty buckets between the first and last arrival are filled so a gap reads as
 * "nobody arrived" instead of collapsing into a misleadingly continuous bar
 * chart. A stray scan hours later would make that series unbounded, so filling is
 * skipped once the span exceeds {@link MAX_ARRIVAL_BUCKETS} and the sparse points
 * are returned as-is.
 */
function buildArrivals(timeins: Date[]): ArrivalBucket[] {
  if (timeins.length === 0) return [];

  const counts = new Map<number, number>();
  for (const timein of timeins) {
    const bucket = floorToBucket(timein);
    counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
  }

  const stamps = [...counts.keys()].sort((a, b) => a - b);
  const first = stamps[0];
  const last = stamps[stamps.length - 1];
  const span = (last - first) / BUCKET_MS + 1;

  if (span > MAX_ARRIVAL_BUCKETS) {
    return stamps.map((stamp) => ({
      bucketStart: new Date(stamp).toISOString(),
      count: counts.get(stamp) ?? 0,
    }));
  }

  const filled: ArrivalBucket[] = [];
  for (let stamp = first; stamp <= last; stamp += BUCKET_MS) {
    filled.push({
      bucketStart: new Date(stamp).toISOString(),
      count: counts.get(stamp) ?? 0,
    });
  }
  return filled;
}

/**
 * Builds the complete report for one event.
 *
 * The caller is responsible for authorization — fetch the event, run
 * `assertEventVisibility(event, user)`, then call this.
 */
export async function buildEventReport(
  event: ReportEvent,
): Promise<EventReport> {
  const eligibleFilter = buildEventStudentFilter(event);

  // Records are scoped to currently-eligible students, preserving the invariant
  // that present can never exceed eligible and that the rows always agree with
  // the totals (`domain-model.md` rule 5). A record whose student left the
  // event's scope still exists in the database but is deliberately invisible here.
  const [students, records] = await Promise.all([
    prisma.student.findMany({
      where: eligibleFilter,
      include: { groups: true },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    }),
    prisma.record.findMany({
      where: { eventId: event.id, student: eligibleFilter },
    }),
  ]);

  const recordByStudent = new Map(records.map((r) => [r.studentId, r] as const));
  const expectsTimeout = computeExpectsTimeout(event, records);

  const totals: ReportTotals = {
    eligible: students.length,
    present: 0,
    late: 0,
    absent: 0,
    attended: 0,
    noTimeout: 0,
    scanned: 0,
    manual: 0,
  };

  const sections = new Map<string, SectionBreakdown>();
  const timeins: Date[] = [];

  const rows: ReportRow[] = students.map((student) => {
    const record = recordByStudent.get(student.id);
    const outcome = deriveOutcome(record, event);
    const noTimeout = hasNoTimeout(record, expectsTimeout);
    const sectionName =
      student.groups.find((group) => group.category === "SECTION")?.name ?? null;

    if (outcome === "PRESENT") totals.present += 1;
    if (outcome === "LATE") totals.late += 1;
    if (outcome === "ABSENT") totals.absent += 1;
    if (outcome !== "ABSENT") totals.attended += 1;
    if (noTimeout) totals.noTimeout += 1;

    if (record?.method === "SCANNED") totals.scanned += 1;
    if (record?.method === "MANUAL") totals.manual += 1;
    if (record?.timein) timeins.push(record.timein);

    const key = sectionName ?? UNGROUPED_SECTION;
    const bucket = sections.get(key) ?? {
      name: key,
      eligible: 0,
      present: 0,
      late: 0,
      absent: 0,
    };
    bucket.eligible += 1;
    if (outcome === "PRESENT") bucket.present += 1;
    if (outcome === "LATE") bucket.late += 1;
    if (outcome === "ABSENT") bucket.absent += 1;
    sections.set(key, bucket);

    return {
      studentId: student.id,
      fullName: fullName(
        student.firstName,
        student.middleName || "",
        student.lastName,
        "last",
      ),
      schoolLevel: student.schoolLevel,
      yearLevel: student.yearLevel,
      section: sectionName,
      timein: record?.timein ? record.timein.toISOString() : null,
      timeout: record?.timeout ? record.timeout.toISOString() : null,
      method: record?.method ?? null,
      outcome,
      noTimeout,
    };
  });

  // "Ungrouped" sorts last so it reads as a remainder rather than a section.
  const bySection = [...sections.values()].sort((a, b) => {
    if (a.name === UNGROUPED_SECTION) return 1;
    if (b.name === UNGROUPED_SECTION) return -1;
    return a.name.localeCompare(b.name);
  });

  return {
    event,
    expectsTimeout,
    totals,
    rate: attendanceRate(totals.attended, totals.eligible),
    arrivals: buildArrivals(timeins),
    bySection,
    rows,
  };
}
