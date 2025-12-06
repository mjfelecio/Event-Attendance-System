"use client";

import React, { useState } from "react";
import AttendancePageHeader from "@/features/attendance/components/AttendancePageHeader";
import ScannerSection from "@/features/attendance/components/AttendanceSection";
import { Event } from "@/globals/types/events";
import AttendanceRecordsTable from "@/features/attendance/components/AttendanceRecordsTable";

const AttendancePage = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <div className="flex flex-col flex-1 bg-white p-6 gap-4 overflow-y-scroll">
      <AttendancePageHeader
        selectedEvent={selectedEvent}
        onChangeEvent={setSelectedEvent}
      />
      <ScannerSection selectedEvent={selectedEvent} />
      <AttendanceRecordsTable selectedEvent={selectedEvent} />
    </div>
  );
};

export default AttendancePage;
