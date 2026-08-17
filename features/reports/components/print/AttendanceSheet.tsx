import { Fragment } from "react";
import Image from "next/image";

import { labelForGroup } from "@/globals/constants/groups";
import type { EventReport, ReportRow } from "@/globals/types/reports";
import {
  ATTENDANCE_OUTCOME_LABEL,
  formatAttendanceRate,
} from "@/globals/utils/attendance";
import { UNGROUPED_SECTION } from "@/globals/utils/eventReport";
import { readableDate } from "@/globals/utils/formatting";
import { capitalizeLabel } from "@/globals/utils/text";

export type SheetOptions = {
  includeAbsentees: boolean;
  groupBySection: boolean;
  includeSignature: boolean;
};

type AttendanceSheetProps = {
  report: EventReport;
  options: SheetOptions;
};

const time = (value: string | null) =>
  value
    ? new Date(value).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

/** One `<tbody>` group: a section heading, its students, then its subtotal. */
const SectionGroup = ({
  title,
  rows,
  startIndex,
  columns,
  options,
  showHeading,
}: {
  title: string;
  rows: ReportRow[];
  startIndex: number;
  columns: number;
  options: SheetOptions;
  showHeading: boolean;
}) => {
  const attended = rows.filter((row) => row.outcome !== "ABSENT").length;

  return (
    <Fragment>
      {showHeading ? (
        <tr className="bg-gray-100 print-break-inside-avoid">
          <td colSpan={columns} className="border border-gray-400 px-2 py-1 font-semibold">
            {title}
          </td>
        </tr>
      ) : null}

      {rows.map((row, index) => (
        <tr key={row.studentId} className="print-break-inside-avoid">
          {/* Continuous across sections — a per-section restart made the sheet
              useless for "how many attended in total". */}
          <td className="border border-gray-400 px-2 py-1 text-right">
            {startIndex + index + 1}
          </td>
          <td className="border border-gray-400 px-2 py-1 font-mono">
            {row.studentId}
          </td>
          <td className="border border-gray-400 px-2 py-1">{row.fullName}</td>
          <td className="border border-gray-400 px-2 py-1 whitespace-nowrap">
            {labelForGroup("YEAR", row.yearLevel)}
          </td>
          <td className="border border-gray-400 px-2 py-1 text-center whitespace-nowrap">
            {time(row.timein)}
          </td>
          <td className="border border-gray-400 px-2 py-1 text-center whitespace-nowrap">
            {time(row.timeout)}
          </td>
          <td className="border border-gray-400 px-2 py-1 text-center">
            {ATTENDANCE_OUTCOME_LABEL[row.outcome]}
          </td>
          {options.includeSignature ? (
            <td className="border border-gray-400 px-2 py-1" />
          ) : null}
        </tr>
      ))}

      {showHeading ? (
        <tr className="print-break-inside-avoid">
          <td
            colSpan={columns}
            className="border border-gray-400 bg-gray-50 px-2 py-1 text-right text-xs font-semibold"
          >
            {title} subtotal: {attended} of {rows.length} attended
          </td>
        </tr>
      ) : null}
    </Fragment>
  );
};

/**
 * The official, printable attendance sheet.
 *
 * A school office needs a document it can file and sign, which the previous plain
 * table was not: it had no letterhead, no signature column, no signatory block,
 * no per-section subtotals, and restarted its row numbering in every section.
 *
 * A server component — none of this needs to ship to the browser, and rendering
 * it server-side keeps the print bundle empty apart from the options bar.
 *
 * **Page numbers are deliberately absent.** Chrome does not support `@page`
 * counters for HTML content, so any "Page 1 of 4" rendered here would be a lie on
 * every sheet after the first. The browser's own print header/footer supplies
 * real ones.
 */
export default function AttendanceSheet({
  report,
  options,
}: AttendanceSheetProps) {
  // The rate is re-derived from the same totals via the shared helper, which is
  // the identical computation `report.rate` already holds — so the sheet and the
  // screen can never print different percentages.
  const { event, totals } = report;

  const rows = options.includeAbsentees
    ? report.rows
    : report.rows.filter((row) => row.outcome !== "ABSENT");

  const columns = options.includeSignature ? 8 : 7;

  // Preserve the report's ordering inside each section rather than re-sorting.
  const groups = options.groupBySection
    ? report.bySection
        .map((section) => ({
          title: section.name,
          rows: rows.filter(
            (row) => (row.section ?? UNGROUPED_SECTION) === section.name,
          ),
        }))
        .filter((group) => group.rows.length > 0)
    : [{ title: "", rows }];

  let runningIndex = 0;

  return (
    <div className="mx-auto w-full max-w-4xl bg-white p-8 text-black print:max-w-none print:p-0">
      {/* ================= Letterhead ================= */}
      <header className="print-break-inside-avoid mb-6 border-b-2 border-black pb-4 text-center">
        <div className="flex items-center justify-center gap-4">
          <Image
            src="/logos/school/aclc.png"
            alt=""
            width={64}
            height={64}
            priority
            className="h-16 w-16 object-contain"
          />
          <div>
            <p className="text-lg font-bold uppercase tracking-wide">
              ACLC College of Ormoc City
            </p>
            <p className="text-sm">Office of Student Affairs</p>
          </div>
        </div>
        <h1 className="mt-3 text-xl font-bold uppercase tracking-[0.15em]">
          Event Attendance Sheet
        </h1>
      </header>

      {/* ================= Event details ================= */}
      <section className="print-break-inside-avoid mb-4 text-sm">
        <h2 className="mb-2 text-lg font-bold">{event.title}</h2>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-1">
          <div className="flex gap-2">
            <dt className="font-semibold">Date &amp; time:</dt>
            <dd>{readableDate(event.start)}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold">Ends:</dt>
            <dd>{readableDate(event.end)}</dd>
          </div>
          {event.location ? (
            <div className="flex gap-2">
              <dt className="font-semibold">Location:</dt>
              <dd>{event.location}</dd>
            </div>
          ) : null}
          <div className="flex gap-2">
            <dt className="font-semibold">Scope:</dt>
            <dd>{capitalizeLabel(event.category)} event</dd>
          </div>
          {event.createdBy ? (
            <div className="flex gap-2">
              <dt className="font-semibold">Organizer:</dt>
              <dd>{event.createdBy.name}</dd>
            </div>
          ) : null}
          {event.category !== "ALL" && event.includedGroups.length > 0 ? (
            <div className="col-span-2 flex gap-2">
              <dt className="font-semibold">Groups:</dt>
              <dd>{event.includedGroups.map((g) => g.name).join(", ")}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      {/* ================= Summary ================= */}
      <section className="print-break-inside-avoid mb-4 border border-gray-400 bg-gray-50 px-3 py-2 text-sm">
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <span>
            <strong>Eligible:</strong> {totals.eligible}
          </span>
          <span>
            <strong>Present:</strong> {totals.present}
          </span>
          <span>
            <strong>Late:</strong> {totals.late}
          </span>
          <span>
            <strong>Absent:</strong> {totals.absent}
          </span>
          {report.expectsTimeout ? (
            <span>
              <strong>No time-out:</strong> {totals.noTimeout}
            </span>
          ) : null}
          <span className="ml-auto">
            <strong>Attendance rate:</strong>{" "}
            {formatAttendanceRate(totals.attended, totals.eligible)}
          </span>
        </div>
        {!options.includeAbsentees && totals.absent > 0 ? (
          <p className="mt-1 text-xs italic">
            This sheet lists attendees only; {totals.absent} absent{" "}
            {totals.absent === 1 ? "student is" : "students are"} omitted.
          </p>
        ) : null}
      </section>

      {/* ================= Roster ================= */}
      <section>
        <table className="print-table w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 px-2 py-1 text-right">No.</th>
              <th className="border border-gray-400 px-2 py-1 text-left">
                Student No.
              </th>
              <th className="border border-gray-400 px-2 py-1 text-left">Name</th>
              <th className="border border-gray-400 px-2 py-1 text-left">Year</th>
              <th className="border border-gray-400 px-2 py-1">Time In</th>
              <th className="border border-gray-400 px-2 py-1">Time Out</th>
              <th className="border border-gray-400 px-2 py-1">Status</th>
              {options.includeSignature ? (
                <th className="border border-gray-400 px-2 py-1">Signature</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns}
                  className="border border-gray-400 px-2 py-6 text-center"
                >
                  No students to list.
                </td>
              </tr>
            ) : (
              groups.map((group) => {
                const startIndex = runningIndex;
                runningIndex += group.rows.length;
                return (
                  <SectionGroup
                    key={group.title || "all"}
                    title={group.title}
                    rows={group.rows}
                    startIndex={startIndex}
                    columns={columns}
                    options={options}
                    showHeading={options.groupBySection}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </section>

      {/* ================= Signatories ================= */}
      <section className="print-break-inside-avoid mt-10 grid grid-cols-2 gap-12 text-sm">
        <div>
          <p className="mb-8">Prepared by:</p>
          <p className="border-t border-black pt-1 text-center font-semibold">
            {event.createdBy?.name ?? ""}
          </p>
          <p className="text-center text-xs">Event Organizer</p>
        </div>
        <div>
          <p className="mb-8">Noted by:</p>
          <p className="border-t border-black pt-1 text-center font-semibold">
            &nbsp;
          </p>
          <p className="text-center text-xs">Office of Student Affairs</p>
        </div>
      </section>

      {/* ================= Footer ================= */}
      <footer className="mt-8 border-t border-gray-400 pt-2 text-[10px] text-gray-600">
        <p>Generated {readableDate(new Date())}.</p>
        {/*
          Eligibility is recomputed from the current roster on every read, so two
          printings of the same event can legitimately differ. Saying so on the
          paper is what makes a filed copy defensible (audit DATA-06 / #45).
        */}
        <p>
          Reflects the student roster as of the time of printing. Roster changes
          made after an event will alter subsequent printings of this report.
        </p>
      </footer>
    </div>
  );
}
