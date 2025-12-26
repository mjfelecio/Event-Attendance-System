"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { capitalize } from "lodash";
import { FaUserGroup } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { VscPercentage } from "react-icons/vsc";

import DataCard from "@/features/attendance/components/DataCard";
import ExportButton from "@/globals/components/shared/buttons/ExportButton";

import { useFetchEvent, useStatsOfEvent } from "@/globals/hooks/useEvents";
import { useDataExport } from "@/globals/hooks/useDataExport";
import { readableDate } from "@/globals/utils/formatting";
import RecordsList from "@/features/reports/components/RecordsList";

const EventReportsPage = () => {
  const { id } = useParams();
  const eventId = String(id);

  const { data: event, isLoading: isEventLoading } = useFetchEvent(eventId);
  const { data: eventStats, isLoading: isStatsLoading } =
    useStatsOfEvent(eventId);

  const { isExporting, exportData } = useDataExport({
    apiUrl: `/api/events/${eventId}/records`,
    filename: "attendance_records",
  });

  const attendanceRate = useMemo(() => {
    if (!eventStats?.eligible) return "—";
    return `${((eventStats.present / eventStats.eligible) * 100).toFixed(1)}%`;
  }, [eventStats]);

  if (isEventLoading || !event) {
    return <div className="p-6 text-lg">Loading event report…</div>;
  }

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto">
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

      {/* ================= Event Metadata ================= */}
      <section className="rounded-md border bg-muted/30 p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-sm">
          <div>
            <p className="text-muted-foreground">Organizer</p>
            <p className="font-medium">{event.userId}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Location</p>
            <p className="font-medium">{event.location}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Participant Groups</p>
            <p className="font-medium">{event.includedGroups}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Start Time</p>
            <p className="font-medium">{readableDate(event.start)}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Event Type</p>
            <p className="font-medium">{capitalize(event.category)} Event</p>
          </div>
        </div>
      </section>

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
