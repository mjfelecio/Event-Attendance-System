"use client";

import React, { useEffect, useState } from "react";
import AttendancePageHeader from "@/features/attendance/components/AttendancePageHeader";
import ScannerSection from "@/features/attendance/components/ScannerSection";
import { Event } from "@/globals/types/events";
import AttendanceRecordsTable from "@/features/attendance/components/AttendanceRecordsTable";
import { fetchEventRecords } from "@/globals/hooks/useRecords";

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
