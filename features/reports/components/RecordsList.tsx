"use client";

import useEvents from "@/globals/hooks/useEvents";
import { Event } from "@/globals/types/events";
import React from "react";
import Toolbar from "./Toolbar";

const RecordsList = () => {
  const { data: events, isLoading, error } = useEvents();

  const handleEventClick = (event: Event) => {
    alert(`Opened ${event.title} event`);
  };

  return (
    <div className="border-2 border-gray-300 rounded-md flex-2 h-full overflow-hidden">
      <Toolbar />

      {/* Attendance Records List */}
      <div className="flex flex-1 items-center justify-center">
        <p className="text-xl font-bold">Records Coming Soon frfr</p>
      </div>
    </div>
  );
};

export default RecordsList;
