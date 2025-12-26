"use client";

import DataCard from "@/features/attendance/components/DataCard";
import { useStatsOfEvent } from "@/globals/hooks/useEvents";
import { Event } from "@/globals/types/events";
import { useMemo } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { VscPercentage } from "react-icons/vsc";

type Props = {
  selectedEvent: Event | null;
};

import React from "react";
import { readableDate } from "@/globals/utils/formatting";
import { capitalize } from "lodash";
import { Button } from "@/globals/components/shad-cn/button";
import { useRouter } from "next/navigation";

const NoSelectionScreen = () => {
  return (
    <div className="flex p-6 justify-center border-2 border-gray-300 rounded-md flex-2 overflow-hidden">
      <p>Select an event to view its details</p>
    </div>
  );
};

const EventSummary = ({ selectedEvent }: Props) => {
  const router = useRouter();
  const { data: eventStats, isLoading: isStatsLoading } = useStatsOfEvent(
    selectedEvent?.id
  );

  // Compute attendance rate
  const attendanceRate = useMemo(() => {
    if (!eventStats || !eventStats.eligible || eventStats.eligible === 0)
      return undefined;
    return Number(
      ((eventStats.present / eventStats.eligible) * 100).toPrecision(4)
    );
  }, [eventStats]);

  if (!selectedEvent) {
    return <NoSelectionScreen />;
  }

  return (
    <div className="flex flex-col gap-4 p-6 items-center border-2 border-gray-300 rounded-md flex-2 overflow-hidden">
      <h3 className="text-4xl font-semibold">{selectedEvent.title}</h3>

      {/* Stats Cards */}
      <div className="flex flex-wrap h-fit gap-6">
        <DataCard
          title="Present"
          subtitle="Students checked in"
          icon={IoMdCheckmarkCircleOutline}
          value={eventStats?.present}
          isLoading={isStatsLoading}
        />
        <DataCard
          title="Total Registered"
          subtitle="Eligible attendees"
          icon={FaUserGroup}
          value={eventStats?.eligible}
          isLoading={isStatsLoading}
        />
        <DataCard
          title="Attendance Rate"
          subtitle="Current percentage"
          icon={VscPercentage}
          value={attendanceRate}
          isLoading={isStatsLoading}
          isPercentage
        />
      </div>

      {/* Event Details */}
      <div className="border w-full rounded-md p-4">
        <p className="text-lg">
          Organized by:{" "}
          <span className="font-semibold">{selectedEvent.userId}</span>
        </p>
        <p className="text-lg">
          Conducted at:{" "}
          <span className="font-semibold">
            {readableDate(selectedEvent.start)}
          </span>
        </p>
        <p className="text-lg">
          Parcipant groups:{" "}
          <span className="font-semibold">{selectedEvent.includedGroups}</span>
        </p>
        <p className="text-lg">
          Location:{" "}
          <span className="font-semibold">{selectedEvent.location}</span>
        </p>
        <p className="text-lg">
          Type:{" "}
          <span className="font-semibold">
            {capitalize(selectedEvent.category)} Event
          </span>
        </p>
      </div>

      {/* View Reports */}
      <Button
        size={"lg"}
        className="self-end"
        onClick={() =>
          router.push(`/reports/events/${selectedEvent.id}`)
        }
      >
        View Detailed Report
      </Button>
    </div>
  );
};

export default EventSummary;
