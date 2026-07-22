"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, CalendarClock, MapPin } from "lucide-react";
import { FaUserGroup } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline, IoMdCloseCircleOutline } from "react-icons/io";
import { VscPercentage } from "react-icons/vsc";

import DataCard from "@/features/attendance/components/DataCard";
import { useStatsOfEvent } from "@/globals/hooks/useEvents";
import { readableDate } from "@/globals/utils/formatting";
import { capitalizeLabel } from "@/globals/utils/text";
import { Event } from "@/globals/types/events";
import { Button } from "@/globals/components/shad-cn/button";
import EventMetadataCard from "./EventMetadataCard";
import EventStatusBadge from "./EventStatusBadge";

type Props = {
  selectedEvent: Event | null;
};

const NoSelectionScreen = () => (
  <div className="flex min-h-64 flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-8 text-center">
    <div className="flex size-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
      <BarChart3 className="size-6" />
    </div>
    <div>
      <p className="text-base font-semibold text-slate-800">No event selected</p>
      <p className="mt-1 text-sm text-slate-500">
        Choose an event from the list to see its attendance summary and open the
        detailed report.
      </p>
    </div>
  </div>
);

const EventSummary = ({ selectedEvent }: Props) => {
  const {
    data: eventStats,
    isLoading,
    isError,
  } = useStatsOfEvent(selectedEvent?.id);

  const attendanceRate = useMemo(() => {
    if (!eventStats?.eligible) return "—";
    return `${((eventStats.present / eventStats.eligible) * 100).toFixed(1)}%`;
  }, [eventStats]);

  if (!selectedEvent) {
    return <NoSelectionScreen />;
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_32px_rgba(15,23,42,0.06)] sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="min-w-0 text-2xl font-semibold text-slate-900">
            {selectedEvent.title}
          </h2>
          <EventStatusBadge status={selectedEvent.status} />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <CalendarClock className="size-4" />
            {readableDate(selectedEvent.start)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BarChart3 className="size-4" />
            {capitalizeLabel(selectedEvent.category)} Event
          </span>
          {selectedEvent.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" />
              {selectedEvent.location}
            </span>
          )}
        </div>
      </div>

      {isError && (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          Couldn&apos;t load attendance totals for this event.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <DataCard
          label="Present"
          description="Checked in"
          icon={IoMdCheckmarkCircleOutline}
          value={String(eventStats?.present ?? 0)}
          isLoading={isLoading}
          className="min-w-0"
        />
        <DataCard
          label="Absent"
          description="Not checked in"
          icon={IoMdCloseCircleOutline}
          value={String(eventStats?.absent ?? 0)}
          isLoading={isLoading}
          className="min-w-0"
        />
        <DataCard
          label="Eligible"
          description="Registered"
          icon={FaUserGroup}
          value={String(eventStats?.eligible ?? 0)}
          isLoading={isLoading}
          className="min-w-0"
        />
        <DataCard
          label="Attendance Rate"
          description="Turnout"
          icon={VscPercentage}
          value={attendanceRate}
          isLoading={isLoading}
          className="min-w-0"
        />
      </div>

      {/* Event metadata */}
      <EventMetadataCard event={selectedEvent} />

      {/* CTA */}
      <div className="flex justify-end">
        <Button asChild>
          <Link href={`/reports/events/${selectedEvent.id}`}>
            View detailed report
            <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default EventSummary;
