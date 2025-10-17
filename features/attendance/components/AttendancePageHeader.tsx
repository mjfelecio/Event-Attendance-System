"use client";

import ButtonWithIcon from "@/globals/components/shared/ButtonWithIcon";
import React, { useMemo } from "react";
import { PiExport } from "react-icons/pi";
import DataCard from "@/features/attendance/components/DataCard";
import ComboBox, { ComboBoxValue } from "@/globals/components/shared/ComboBox";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaUserGroup } from "react-icons/fa6";
import { VscPercentage } from "react-icons/vsc";
import useEvents from "@/globals/hooks/useEvents";
import { Event } from "@/globals/types/events";

type Props = {
  selectedEvent: Event | null;
  onChangeEvent: (event: Event) => void;
};

const AttendancePageHeader = ({ selectedEvent, onChangeEvent }: Props) => {
  const { data } = useEvents();

  const eventChoices: ComboBoxValue[] = useMemo(() => {
    if (data) return data?.map((e) => ({ value: e.id, label: e.title }));
    else return [];
  }, [data]);

  const handleSelectEvent = (eventId: string) => {
    const event = data?.find((e) => e.id === eventId);
    if (!event) {
      console.log("Selected event was not in the list");
      return;
    }

    onChangeEvent(event);
  } 

  return (
    <div className="flex flex-col gap-4">
      {/* Top Part of Header */}
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold">Attendance Tracking</h1>

        {/* Right Side */}
        <ButtonWithIcon
          icon={PiExport}
          onClick={() => alert("Exporting attendance records...")}
        >
          Export
        </ButtonWithIcon>
      </div>

      {/* Bottom Part of the Header */}
      <div className="flex justify-between gap-6">
        {/* Event Selection Dropdown */}
        <div className="border-2 border-gray-300 rounded-md p-3 flex flex-col gap-2">
          <p className="font-medium ml-1 text-lg">Select Event</p>
          <ComboBox
            choices={eventChoices}
            selectedValue={selectedEvent?.id ?? ""}
            onSelect={handleSelectEvent}
            placeholder="Select an event"
            searchFallbackMsg="No results"
          />
        </div>

        <div className="flex flex-row gap-6">
          <DataCard
            title="Present"
            subtitle="Students checked in"
            icon={IoMdCheckmarkCircleOutline}
            value={0}
          />
          <DataCard
            title="Total Registered"
            subtitle="Expected attendees"
            icon={FaUserGroup}
            value={0}
          />
          <DataCard
            title="Attendance Rate"
            subtitle="Current rate"
            icon={VscPercentage}
            value={0}
          />
        </div>
      </div>
    </div>
  );
};

export default AttendancePageHeader;
