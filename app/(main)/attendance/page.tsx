"use client";

import React, { useState } from "react";
import AttendancePageHeader from "@/features/attendance/components/AttendancePageHeader";
import ScannerSection from "@/features/attendance/components/ScannerSection";
import AttendanceTable from "@/features/attendance/components/AttendanceTable";

const AttendancePage = () => {
  const [selectedEvent, setSelectedEvent] = useState("");

  return (
    <div className="flex flex-col flex-1 bg-white p-6 gap-4 overflow-y-scroll">
      <AttendancePageHeader selectedEvent={selectedEvent} onChangeEvent={setSelectedEvent} />
      <ScannerSection />
      <AttendanceTable />
    </div>
  );
};

export default AttendancePage;
