"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { capitalize } from "lodash";
import { FaUserGroup } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { VscPercentage } from "react-icons/vsc";

import DataCard from "@/features/attendance/components/DataCard";
import { useStatsOfEvent } from "@/globals/hooks/useEvents";
import { readableDate } from "@/globals/utils/formatting";
import { Event } from "@/globals/types/events";
import { Button } from "@/globals/components/shad-cn/button";

type Props = {
  selectedEvent: Event | null;
};

const NoSelectionScreen = () => {
  return (
    <div className="flex items-center justify-center rounded-md border bg-muted/40 p-8 text-sm text-muted-foreground">
      Select an event to view its summary
    </div>
  );
};

const EventSummary = ({ selectedEvent }: Props) => {
  const router = useRouter();

  const { data: eventStats, isLoading } = useStatsOfEvent(
    selectedEvent?.id
  );

  const attendanceRate = useMemo(() => {
    if (!eventStats?.eligible) return "—";
    return `${((eventStats.present / eventStats.eligible) * 100).toFixed(1)}%`;
  }, [eventStats]);

  if (!selectedEvent) {
    return <NoSelectionScreen />;
  }

  return (
    <div className="flex flex-2 flex-col gap-6 rounded-md border p-6 bg-background">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold">
          {selectedEvent.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {readableDate(selectedEvent.start)} •{" "}
          {capitalize(selectedEvent.category)} Event
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DataCard
          label="Present"
          description="Checked in"
          icon={IoMdCheckmarkCircleOutline}
          value={String(eventStats?.present ?? 0)}
          isLoading={isLoading}
        />

        <DataCard
          label="Eligible"
          description="Registered"
          icon={FaUserGroup}
          value={String(eventStats?.eligible ?? 0)}
          isLoading={isLoading}
        />

        <DataCard
          label="Attendance Rate"
          description="Turnout"
          icon={VscPercentage}
          value={attendanceRate}
          isLoading={isLoading}
        />
      </div>

      {/* Event metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Organizer</p>
          <p className="font-medium">{selectedEvent.userId}</p>
        </div>

        <div>
          <p className="text-muted-foreground">Location</p>
          <p className="font-medium">{selectedEvent.location}</p>
        </div>

        <div>
          <p className="text-muted-foreground">Participant Groups</p>
          <p className="font-medium">
            {selectedEvent.includedGroups}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() =>
            router.push(`/reports/events/${selectedEvent.id}`)
          }
        >
          View detailed report
        </Button>
      </div>
    </div>
  );
};

export default EventSummary;
