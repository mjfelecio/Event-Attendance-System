"use client";

import React, { useState } from "react";
import AttendancePageHeader from "@/features/attendance/components/AttendancePageHeader";
import AttendanceSection from "@/features/attendance/components/AttendanceSection";
import AttendanceRecordsTable from "@/features/attendance/components/AttendanceRecordsTable";
import { useFetchEvent } from "@/globals/hooks/useEvents";

const AttendancePage = () => {
  // Hold only the id and derive ONE live event object from it, so the header,
  // scanner, manual actions, and records table all share the same fresh event
  // (isTimeout, ownership) instead of a stale selection copy.
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const { data: liveEvent } = useFetchEvent(selectedEventId ?? undefined, true);
  const selectedEvent = liveEvent ?? null;

  return (
    <div className="flex flex-col flex-1 bg-white p-6 gap-4 overflow-y-scroll min-h-svh">
      <AttendancePageHeader
        selectedEvent={selectedEvent}
        onChangeEvent={(event) => setSelectedEventId(event.id)}
      />
      <AttendanceSection selectedEvent={selectedEvent} />
      <AttendanceRecordsTable selectedEvent={selectedEvent} />
    </div>
  );
};

export default AttendancePage;
