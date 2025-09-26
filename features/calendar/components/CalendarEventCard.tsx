import { EventContentArg } from "@fullcalendar/core/index.js";
import React from "react";

const CalendarEventCard = ({ arg }: { arg: EventContentArg }) => {
  // Remove trailing dash for draft events
  const cleanTimeText = arg.timeText.replace(/\s*-\s*$/, "");

  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="font-medium">{cleanTimeText}</p>
    </div>
  );
};

export default CalendarEventCard;
