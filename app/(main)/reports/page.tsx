"use client";

import EventsList from "@/features/reports/components/EventsList";
import EventSummary from "@/features/reports/components/EventSummary";
import RecordsList from "@/features/reports/components/RecordsList";
import { Event } from "@/globals/types/events";
import React, { useState } from "react";

const ReportsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <div className="flex flex-col flex-1 p-4">
      <h1 className="text-3xl font-medium mb-4">Reports Page</h1>
      <div className="flex flex-1 gap-4">
        <EventsList
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
        />
        <EventSummary selectedEvent={selectedEvent} />
      </div>
    </div>
  );
};

export default ReportsPage;
