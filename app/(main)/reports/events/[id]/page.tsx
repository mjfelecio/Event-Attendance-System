"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Download, Printer } from "lucide-react";
import { FaUserGroup } from "react-icons/fa6";
import {
  IoMdCheckmarkCircleOutline,
  IoMdCloseCircleOutline,
} from "react-icons/io";
import { VscPercentage } from "react-icons/vsc";

import DataCard from "@/features/attendance/components/DataCard";

import { useFetchEvent, useStatsOfEvent } from "@/globals/hooks/useEvents";
import { useDataExport } from "@/globals/hooks/useDataExport";
import { readableDate } from "@/globals/utils/formatting";
import { capitalizeLabel } from "@/globals/utils/text";
import RecordsList from "@/features/reports/components/RecordsList";
import EventMetadataCard from "@/features/reports/components/EventMetadataCard";
import EventStatusBadge from "@/features/reports/components/EventStatusBadge";
import { Button } from "@/globals/components/shad-cn/button";

const EventReportsPage = () => {
  const { id } = useParams();
  const eventId = String(id);

  const {
    data: event,
    isLoading: isEventLoading,
    isError: isEventError,
  } = useFetchEvent(eventId);
  const {
    data: eventStats,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useStatsOfEvent(eventId);

  const { isExporting, exportData } = useDataExport({
    // includeAbsent so the CSV matches the on-screen report (present + absent),
    // not just the present rows.
    apiUrl: `/api/events/${eventId}/records?includeAbsent=true`,
    filename: "attendance_records",
  });

  const attendanceRate = useMemo(() => {
    if (!eventStats?.eligible) return "—";
    return `${((eventStats.present / eventStats.eligible) * 100).toFixed(1)}%`;
  }, [eventStats]);

  if (isEventLoading) {
    return <div className="p-6 text-lg text-slate-600">Loading event report…</div>;
  }

  if (isEventError || !event) {
    return (
      <div className="p-6">
        <div className="rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          Couldn&apos;t load this event report. It may have been removed, or you
          may not have access. Please go back and try again.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 sm:p-6 lg:p-8">
      {/* Breadcrumb */}
      <Link
        href="/reports"
        className="inline-flex w-fit items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:rounded"
      >
        <ChevronLeft className="size-4" />
        Back to Reports
      </Link>

      {/* ================= Header ================= */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold text-slate-900">
              {event.title}
            </h1>
            <EventStatusBadge status={event.status} />
          </div>
          <p className="text-sm text-slate-500">
            {readableDate(event.start)} • {capitalizeLabel(event.category)} Event
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button asChild variant="outline">
            <Link href={`/reports/events/${eventId}/print`} target="_blank">
              <Printer className="size-4" />
              Print Report
            </Link>
          </Button>

          <Button onClick={exportData} disabled={isExporting}>
            <Download className="size-4" />
            {isExporting ? "Exporting…" : "Export CSV"}
          </Button>
        </div>
      </section>

      {isStatsError && (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          Couldn&apos;t load attendance totals. The numbers below may be
          incomplete.
        </div>
      )}

      {/* ================= Attendance Summary ================= */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DataCard
          label="Present"
          description="Checked-in attendees"
          icon={IoMdCheckmarkCircleOutline}
          value={String(eventStats?.present ?? 0)}
          isLoading={isStatsLoading}
          className="min-w-0"
        />
        <DataCard
          label="Absent"
          description="Not checked in"
          icon={IoMdCloseCircleOutline}
          value={String(eventStats?.absent ?? 0)}
          isLoading={isStatsLoading}
          className="min-w-0"
        />
        <DataCard
          label="Eligible"
          description="Registered attendees"
          icon={FaUserGroup}
          value={String(eventStats?.eligible ?? 0)}
          isLoading={isStatsLoading}
          className="min-w-0"
        />
        <DataCard
          label="Attendance Rate"
          description="Current percentage"
          icon={VscPercentage}
          value={attendanceRate}
          isLoading={isStatsLoading}
          className="min-w-0"
        />
      </section>

      <EventMetadataCard event={event} />

      {/* ================= Attendance Records ================= */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Attendance Records
          </h2>
          <p className="text-sm text-slate-500">
            Detailed list of participants and their attendance status
          </p>
        </div>

        <RecordsList selectedEvent={event} />
      </section>
    </div>
  );
};

export default EventReportsPage;
