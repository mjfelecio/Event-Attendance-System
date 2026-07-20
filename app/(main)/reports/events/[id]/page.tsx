"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { capitalize } from "@/globals/utils/text";
import { FaUserGroup } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { VscPercentage } from "react-icons/vsc";

import DataCard from "@/features/attendance/components/DataCard";
import ExportButton from "@/globals/components/shared/buttons/ExportButton";

import { useFetchEvent, useStatsOfEvent } from "@/globals/hooks/useEvents";
import { useDataExport } from "@/globals/hooks/useDataExport";
import { readableDate } from "@/globals/utils/formatting";
import RecordsList from "@/features/reports/components/RecordsList";
import EventMetadataCard from "@/features/reports/components/EventMetadataCard";

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
    apiUrl: `/api/events/${eventId}/records`,
    filename: "attendance_records",
  });

  const attendanceRate = useMemo(() => {
    if (!eventStats?.eligible) return "—";
    return `${((eventStats.present / eventStats.eligible) * 100).toFixed(1)}%`;
  }, [eventStats]);

  if (isEventLoading) {
    return <div className="p-6 text-lg">Loading event report…</div>;
  }

  if (isEventError || !event) {
    return (
      <div className="p-6">
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Couldn&apos;t load this event report. It may have been removed, or you
          may not have access. Please go back and try again.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6 w-4xl mx-auto">
      {/* ================= Header ================= */}
      <section className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold">{event.title}</h1>
          <p className="text-sm text-muted-foreground">
            {readableDate(event.start)} • {capitalize(event.category)} Event
          </p>
        </div>

        <ExportButton
          onExport={exportData}
          isLoading={isExporting}
          label="Export CSV"
        />
      </section>

      {isStatsError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Couldn&apos;t load attendance totals. The numbers below may be
          incomplete.
        </div>
      )}

      {/* ================= Attendance Summary ================= */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <DataCard
          label="Present"
          description="Checked-in attendees"
          icon={IoMdCheckmarkCircleOutline}
          value={String(eventStats?.present ?? 0)}
          isLoading={isStatsLoading}
        />

        <DataCard
          label="Eligible"
          description="Registered attendees"
          icon={FaUserGroup}
          value={String(eventStats?.eligible ?? 0)}
          isLoading={isStatsLoading}
        />

        <DataCard
          label="Attendance Rate"
          description="Current percentage"
          icon={VscPercentage}
          value={attendanceRate}
          isLoading={isStatsLoading}
        />
      </section>

      <EventMetadataCard event={event} />

      {/* ================= Attendance Records ================= */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold">Attendance Records</h2>
          <p className="text-sm text-muted-foreground">
            Detailed list of participants and their attendance status
          </p>
        </div>

        <RecordsList selectedEvent={event} />
      </section>
    </div>
  );
};

export default EventReportsPage;
