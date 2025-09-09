"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { DateSelectArg } from "@fullcalendar/core/index.js";

const Calendar = () => {
  const handleDateClick = (info: DateClickArg) => {
    alert("Clicked" + info.dateStr);
  };

  const handleSelectEvents = (info: DateSelectArg) => {
    alert(`Selected ${info.startStr} to ${info.endStr}`)
  };

  return (
    <div className="rounded-2xl border-2 p-6 max-h-[600px] overflow-hidden basis-[70%]">
      <FullCalendar
        height={"100%"}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        selectable
        dateClick={handleDateClick}
        select={handleSelectEvents}
      />
    </div>
  );
};

export default Calendar;
