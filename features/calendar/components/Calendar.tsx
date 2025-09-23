"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { DateSelectArg } from "@fullcalendar/core/index.js";
import { useCallback, useEffect, useRef } from "react";
import { useSidebar } from "@/globals/contexts/SidebarContext";

type Props = {
  onSelectDate: (start: Date, end: Date) => void;
};

const Calendar = ({ onSelectDate }: Props) => {
  const { isExpanded: isSidebarExpanded } = useSidebar();
  const calendarRef = useRef<FullCalendar | null>(null);

  useEffect(() => {
    // Trigger rerender of calendar when sidebarExpanded changes
    setTimeout(() => calendarRef.current?.getApi().updateSize(), 300);
  }, [isSidebarExpanded]);

  const handleSelectDate = useCallback((info: DateSelectArg) => {
    // FullCalendar's "select" gives us a [start, end) range
    // meaning start is inclusive, end is exclusive.
    // Example: selecting just Sept 23 gives start=2025-09-23 and end=2025-09-24.
    // This makes "single day" selections look like a 2-day difference in Date objects.
    const isSingleDay = info.end.getDate() - info.start.getDate() === 1;

    if (isSingleDay) {
      // Use info.startStr instead of info.start because:
      // - info.start is a JS Date in local timezone (may shift depending on TZ/DST)
      // - info.startStr is the normalized ISO8601 string from FullCalendar
      onSelectDate(new Date(info.startStr), new Date(info.startStr));
    } else {
      // For multi-day ranges, end is exclusive
      // So if user selects Sept 23 → Sept 25,
      // info.startStr = "2025-09-23", info.endStr = "2025-09-26"
      // We subtract 1 day from endStr so the range is inclusive
      const endDate = new Date(info.endStr);
      endDate.setDate(info.end.getDate() - 1);

      onSelectDate(new Date(info.startStr), new Date(endDate));
    }
  }, []);

  return (
    <div className="rounded-2xl border-2 p-6 max-h-[600px] overflow-hidden basis-[70%]">
      <FullCalendar
        ref={calendarRef}
        height={"100%"}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        selectable
        select={handleSelectDate}
      />
    </div>
  );
};

export default Calendar;
