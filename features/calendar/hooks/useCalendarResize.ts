import { useEffect, RefObject } from "react";
import FullCalendar from "@fullcalendar/react";
import { CALENDAR_CONFIG } from "@/features/calendar/constants/calendarConfig";

export const useCalendarResize = (
  calendarRef: RefObject<FullCalendar | null>,
  isSidebarExpanded: boolean
) => {
  useEffect(() => {
    if (!calendarRef) return;

    const timeoutId = setTimeout(() => {
      calendarRef.current?.getApi().updateSize();
    }, CALENDAR_CONFIG.SIDEBAR_RESIZE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [isSidebarExpanded, calendarRef]);
};
