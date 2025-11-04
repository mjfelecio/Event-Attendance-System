"use client";

import React, { useMemo } from "react";
import { PiExport } from "react-icons/pi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaUserGroup } from "react-icons/fa6";
import { VscPercentage } from "react-icons/vsc";

import ButtonWithIcon from "@/globals/components/shared/ButtonWithIcon";
import ComboBox, { ComboBoxValue } from "@/globals/components/shared/ComboBox";
import DataCard from "@/features/attendance/components/DataCard";

import useEvents, { useEventStats } from "@/globals/hooks/useEvents";
import { Event } from "@/globals/types/events";

type Props = {
  selectedEvent: Event | null;
  onChangeEvent: (event: Event) => void;
};

const AttendancePageHeader: React.FC<Props> = ({
  selectedEvent,
  onChangeEvent,
}) => {
  const { data: events, isLoading: isEventsLoading } = useEvents();
  const {
    data: eventStats,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useEventStats(selectedEvent?.id);

  // Compute attendance rate
  const attendanceRate = useMemo(() => {
    if (!eventStats || !eventStats.eligible || eventStats.eligible === 0)
      return undefined;
    return Number(((eventStats.present / eventStats.eligible) * 100).toPrecision(4));
  }, [eventStats]);

  // Build combobox options
  const eventChoices: ComboBoxValue[] = useMemo(() => {
    if (!events) return [];
    return events.map((e) => ({
      value: e.id,
      label: e.title,
    }));
  }, [events]);

  // Handle selecting a new event
  const handleSelectEvent = (eventId: string) => {
    const found = events?.find((e) => e.id === eventId);
    if (!found) {
      console.warn("⚠️ Selected event not found in events list");
      return;
    }
    onChangeEvent(found);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* === Header Top === */}
      <div className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Attendance Tracking
          </h1>
          {selectedEvent && isNaN(attendanceRate ?? NaN) && (
            <p className="text-sm text-red-600 mt-1">
              No eligible students found for this event.
            </p>
          )}
          {isStatsError && (
            <p className="text-sm text-red-500 mt-1">
              Error fetching attendance data.
            </p>
          )}
        </div>

        {/* Export Button */}
        <ButtonWithIcon
          icon={PiExport}
          onClick={() => alert("Exporting attendance records...")}
        >
          Export
        </ButtonWithIcon>
      </div>

      {/* === Header Bottom === */}
      <div className="flex flex-wrap gap-6 justify-between">
        {/* Event Selection */}
        <div className="border-2 border-gray-300 rounded-md p-4 flex flex-col gap-2 min-w-[280px]">
          <p className="font-medium text-lg text-gray-700">Select Event</p>
          <ComboBox
            choices={eventChoices}
            selectedValue={selectedEvent?.id ?? ""}
            onSelect={handleSelectEvent}
            placeholder={
              isEventsLoading ? "Loading events..." : "Select an event"
            }
            searchFallbackMsg="No events found"
          />
        </div>

        {/* Stats Cards */}
        <div className="flex flex-wrap gap-6">
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
      </div>
    </div>
  );
};

export default AttendancePageHeader;
