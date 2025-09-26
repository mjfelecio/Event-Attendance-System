import { useCallback, useEffect, useState } from "react";
import { DateSelectArg } from "@fullcalendar/core";
import { DraftEvent } from "@/features/calendar/types/calendar";
import { calculateEndDate, createDraftEvent } from "@/features/calendar/utils/calendar";

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
      const isSingleDay = info.end.getDate() - info.start.getDate() === 1;
      const start = new Date(info.startStr);
      const end = calculateEndDate(start, info.end, isSingleDay);

      setDraftEvent(createDraftEvent(start, info.end));
      onSelectDate(start, end);
    },
    [onSelectDate]
  );

  return { draftEvent, setDraftEvent, handleSelectDate };
};