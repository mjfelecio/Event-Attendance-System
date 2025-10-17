"use client";

import React, { useState } from "react";
import AttendancePageHeader from "@/features/attendance/components/AttendancePageHeader";
import ScannerSection from "@/features/attendance/components/ScannerSection";
import AttendanceRecordsTable from "@/features/attendance/components/AttendanceTable";
import { Event } from "@/globals/types/events";

const AttendancePage = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <div className="flex flex-col flex-1 bg-white p-6 gap-4 overflow-y-scroll">
      <AttendancePageHeader selectedEvent={selectedEvent} onChangeEvent={setSelectedEvent} />
      <ScannerSection selectedEvent={selectedEvent} />
      <AttendanceRecordsTable />
    </div>
  );
};

export default AttendancePage;
