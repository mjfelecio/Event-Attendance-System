"use client";

import EventsList from "@/features/reports/components/EventsList";
import EventSummary from "@/features/reports/components/EventSummary";
import { Event } from "@/globals/types/events";
import React, { useState } from "react";

const ReportsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto bg-[radial-gradient(circle_at_top,#eef2ff_0%,#f8fafc_45%,#ffffff_100%)] p-4 md:p-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Reports
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Inspect attendance for any event and export detailed reports.
        </p>
      </header>

      {/* Browser beside the summary on desktop, stacked on mobile/tablet. The
          minmax(0, …) tracks let either side shrink so neither forces the page
          to scroll horizontally. */}
      <div className="grid flex-1 grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
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
