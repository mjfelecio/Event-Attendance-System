import { useCallback, useEffect, useState } from "react";
import { DateSelectArg } from "@fullcalendar/core";
import { DraftEvent } from "@/features/calendar/types/calendar";
import { createDraftEvent } from "@/features/calendar/utils/calendar";
import { CALENDAR_CONFIG } from "@/features/calendar/constants/calendarConfig";

export const useDraftEvent = (
  isDrawerOpen: boolean,
  onSelectDate: (start: Date, end: Date) => void
) => {
  const [draftEvent, setDraftEvent] = useState<DraftEvent | null>(null);

  useEffect(() => {
    if (!isDrawerOpen) {
      setDraftEvent(null);
    }
  }, [isDrawerOpen]);

  const handleSelectDate = useCallback(
    (info: DateSelectArg) => {
      const start = info.start;

      let end: Date;
      if (!info.allDay) {
        // Timed selection (week/day views): keep the exact selected duration
        end = info.end;
      } else {
        // All-day selection: FullCalendar's end is exclusive (midnight after
        // the last selected day). Time-based math, not day-of-month, so
        // month boundaries work.
        const isSingleDay =
          info.end.getTime() - info.start.getTime() <=
          CALENDAR_CONFIG.MILLISECONDS_PER_DAY;
        end = isSingleDay
          ? new Date(start.getTime() + 60 * 60 * 1000) // default 1-hour slot
          : new Date(
              info.end.getTime() - CALENDAR_CONFIG.MILLISECONDS_PER_DAY
            );
      }

      setDraftEvent(createDraftEvent(start, info.end));
      onSelectDate(start, end);
    },
    [onSelectDate]
  );

  return { draftEvent, setDraftEvent, handleSelectDate };
};