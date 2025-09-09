"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const Calendar = () => {
  return (
    <div className="rounded-2xl border-2 p-6 max-h-[600px] overflow-hidden basis-[70%]">
      <FullCalendar height={"100%"} plugins={[dayGridPlugin]} initialView="dayGridMonth" />
    </div>
  );
};

export default Calendar;
