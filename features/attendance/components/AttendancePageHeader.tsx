"use client";

import React, { useMemo } from "react";
import { PiExport } from "react-icons/pi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaUserGroup } from "react-icons/fa6";
import { VscPercentage } from "react-icons/vsc";
import ButtonWithIcon from "@/globals/components/shared/ButtonWithIcon";
import ComboBox, { ComboBoxValue } from "@/globals/components/shared/ComboBox";
import DataCard from "@/features/attendance/components/DataCard";
import {
  useFetchApprovedEvents,
  useStatsOfEvent,
} from "@/globals/hooks/useEvents";
import { Event } from "@/globals/types/events";
import TurnOnTimeoutMode from "@/features/attendance/components/TurnOnTimeoutMode";
import Link from "next/link";
import { MdReport } from "react-icons/md";
import { IoDocument } from "react-icons/io5";
import { useAuth } from "@/globals/contexts/AuthContext";

type Props = {
  // Already the live event (the page derives it from useFetchEvent).
  selectedEvent: Event | null;
  onChangeEvent: (event: Event) => void;
};

const AttendancePageHeader: React.FC<Props> = ({
  selectedEvent,
  onChangeEvent,
}) => {
  const { user } = useAuth();
  const { data: events, isLoading: isEventsLoading } = useFetchApprovedEvents();
  const currentEvent = selectedEvent;
  const canManageEvent =
    !!currentEvent &&
    (user?.role === "ADMIN" || currentEvent.createdById === user?.id);
  const {
    data: eventStats,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useStatsOfEvent(selectedEvent?.id, true);

  // Compute attendance rate
  const attendanceRate = useMemo(() => {
    if (!eventStats?.eligible) return "—";
    return `${((eventStats.present / eventStats.eligible) * 100).toFixed(1)}%`;
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
      console.warn("Selected event not found in events list");
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
          {selectedEvent &&
            !isEventsLoading &&
            !isStatsLoading &&
            attendanceRate === "—" && (
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

        <div className="flex flex-row gap-4 items-center">
          {/* View Report Button - only navigable once an event is selected,
              so it can't link to /reports/events/undefined. */}
          {selectedEvent?.id ? (
            <Link
              href={`/reports/events/${selectedEvent.id}`}
              target="_blank"
            >
              <ButtonWithIcon variant="ghost" icon={IoDocument}>
                View Report
              </ButtonWithIcon>
            </Link>
          ) : (
            <ButtonWithIcon variant="ghost" icon={IoDocument} disabled>
              View Report
            </ButtonWithIcon>
          )}

          {/* Timeout Mode Button */}
          <TurnOnTimeoutMode
            eventId={currentEvent?.id}
            isTimeout={currentEvent?.isTimeout ?? false}
            canToggle={canManageEvent}
          />

          {/* Export is not implemented yet - disabled rather than shown as a
              working control (see deferred export PR). */}
          <ButtonWithIcon icon={PiExport} disabled title="Export coming soon">
            Export
          </ButtonWithIcon>
        </div>
      </div>

      {/* === Header Bottom === */}
      <div className="flex flex-wrap gap-6 justify-between">
        {/* Event Selection */}
        <div className="border shadow-sm rounded-md p-4 flex flex-col gap-2 min-w-[280px]">
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
            label="Present"
            description="Students checked in"
            icon={IoMdCheckmarkCircleOutline}
            value={String(eventStats?.present ?? "—")}
            isLoading={isStatsLoading}
          />
          <DataCard
            label="Total Registered"
            description="Eligible attendees"
            icon={FaUserGroup}
            value={String(eventStats?.eligible ?? "—")}
            isLoading={isStatsLoading}
          />
          <DataCard
            label="Attendance Rate"
            description="Current percentage"
            icon={VscPercentage}
            value={attendanceRate}
            isLoading={isStatsLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AttendancePageHeader;
