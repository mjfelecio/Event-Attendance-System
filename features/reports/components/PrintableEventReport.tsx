"use client";

import { capitalize } from "lodash";

import DataCard from "@/features/attendance/components/DataCard";
import EventMetadataCard from "@/features/reports/components/EventMetadataCard";
import { Event } from "@/globals/types/events";
import { Record } from "@/globals/types/records";
import { readableDate, readableTime } from "@/globals/utils/formatting";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaUserGroup } from "react-icons/fa6";
import { VscPercentage } from "react-icons/vsc";
import { Prisma } from "@prisma/client";

type EventStats = {
  present: number;
  eligible: number;
};

export type EventWithGroupsAndCreator = Prisma.EventGetPayload<{
  include: {
    includedGroups: true;
    createdBy: true;
  };
}>;

export type StudentWithRecords = Prisma.StudentGetPayload<{
  include: {
    records: true;
    groups: true;
  };
}>;

type PrintableEventReportProps = {
  event: EventWithGroupsAndCreator;
  records: StudentWithRecords[];
  stats: EventStats;
};

export default function PrintableEventReport({
  event,
  records,
  stats,
}: PrintableEventReportProps) {
  const attendanceRate =
    stats.eligible > 0
      ? `${((stats.present / stats.eligible) * 100).toFixed(1)}%`
      : "—";

  return (
    <div className="mx-auto w-full max-w-4xl bg-white p-8 text-black print:max-w-none print:p-0">
      {/* ==========================================================
          PRINT STYLES
      ========================================================== */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0.5in;
          }

          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .print-break-inside-avoid {
            break-inside: avoid;
          }

          .print-table thead {
            display: table-header-group;
          }

          .print-table tr {
            break-inside: avoid;
          }
        }
      `}</style>

      {/* ==========================================================
          HEADER
      ========================================================== */}
      <header className="mb-4 print-break-inside-avoid">
        <div className="flex border-b pb-1 items-start justify-between gap-8">
          {/* Event Information */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{event.title}</h1>

            <p className="mt-1 text-sm text-gray-600">
              {readableDate(event.start)} • {capitalize(event.category)} Event
            </p>
          </div>

          {/* Attendance Summary */}
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Attendance Rate
            </p>

            <p className="text-3xl font-bold">{attendanceRate}</p>

            <p className="text-sm text-gray-600">
              {stats.present} of {stats.eligible} attendees
            </p>
          </div>
        </div>

        {/* Event Details */}
        <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
          {event.location && (
            <div>
              <span className="font-semibold">Location:</span> {event.location ?? "--"}
            </div>
          )}

          {event.createdBy && (
            <div>
              <span className="font-semibold">Organizer:</span>{" "}
              {event.createdBy.name}
            </div>
          )}

          <div>
            <span className="font-semibold">Start:</span>{" "}
            {readableDate(event.start)}
          </div>

          {event.end && (
            <div>
              <span className="font-semibold">End:</span>{" "}
              {readableDate(event.end)}
            </div>
          )}

          <div>
            <span className="font-semibold">Category:</span>{" "}
            {capitalize(event.category)}
          </div>
        </div>

        {event.includedGroups.length > 0 && (
          <div className="mt-2 text-sm">
            <span className="font-semibold">Groups:</span>{" "}
            {event.includedGroups.map((g) => g.name).join(", ")}
          </div>
        )}
      </header>

      {/* ==========================================================
          ATTENDANCE RECORDS
      ========================================================== */}
      <section>
        <table className="print-table w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-t bg-gray-50">
              <th className="px-3 py-2 text-left font-semibold">#</th>
              <th className="px-3 py-2 text-left font-semibold">Student ID</th>
              <th className="px-3 py-2 text-left font-semibold">
                Student Name
              </th>
              <th className="px-3 py-2 text-left font-semibold">Status</th>
              <th className="px-3 py-2 text-left font-semibold">Time In</th>
              <th className="px-3 py-2 text-left font-semibold">Time Out</th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-gray-500">
                  No attendance records found.
                </td>
              </tr>
            ) : (
              records.map((record, index) => {
                const student = record;
                const isPresent = record.records.length > 0;

                const fullName = student
                  ? [student.lastName, student.firstName, student.middleName]
                      .filter(Boolean)
                      .join(", ")
                  : "Unknown Student";

                const timeIn = isPresent ? record.records[0].timein : null;
                const timeOut = isPresent ? record.records[0].timeout : null;

                return (
                  <tr
                    key={record.id}
                    className="border-b align-top print-break-inside-avoid"
                  >
                    <td className="px-3 py-2">{index + 1}</td>

                    <td className="px-3 py-2 font-mono">{record.id}</td>

                    <td className="px-3 py-2">{fullName}</td>

                    <td className="px-3 py-2">
                      {isPresent ? "Present" : "Absent"}
                    </td>

                    <td className="px-3 py-2">
                      {timeIn ? readableTime(timeIn) : "—"}
                    </td>

                    <td className="px-3 py-2">
                      {timeOut ? readableTime(timeOut) : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>

      {/* ==========================================================
          FOOTER
      ========================================================== */}
      <footer className="mt-8 border-t pt-3 text-xs text-gray-500">
        Generated on {readableDate(new Date())}
      </footer>
    </div>
  );
}
