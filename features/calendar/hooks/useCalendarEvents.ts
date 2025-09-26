import { useCallback } from "react";
import { EventClickArg, EventDropArg } from "@fullcalendar/core";
import { EventResizeDoneArg } from "@fullcalendar/interaction";
import { Event } from "@/globals/types/events";
import { CALENDAR_CONFIG } from "@/features/calendar/constants/calendarConfig";
import { findEventById } from "@/features/calendar/utils/calendar";

export const useCalendarEvents = (
  data: Event[] | undefined,
  saveEvent: (event: Event) => void,
  onEditEvent?: (event: Event) => void
) => {
  const handleEventClick = useCallback(
    (info: EventClickArg) => {
      if (info.event.id === CALENDAR_CONFIG.DRAFT_EVENT_ID || !onEditEvent) {
        return;
      }

      const event = findEventById(data, info.event.id);
      if (event) {
        onEditEvent(event);
      }
    },
    [data, onEditEvent]
  );

  const handleEventResize = useCallback(
    async (info: EventResizeDoneArg) => {
      if (info.event.id === CALENDAR_CONFIG.DRAFT_EVENT_ID) {
        info.revert();
        return;
      }

      const event = findEventById(data, info.event.id);
      if (!event) {
        info.revert();
        return;
      }

      const updatedEvent: Event = {
        ...event,
        start: info.event.start!,
        end: info.event.end ?? info.event.start!,
        allDay: info.event.allDay,
      };

      saveEvent(updatedEvent);
    },
    [data, saveEvent]
  );

  const handleEventDrop = useCallback(
    (info: EventDropArg) => {
      if (info.event.id === CALENDAR_CONFIG.DRAFT_EVENT_ID) {
        info.revert();
        return;
      }

      const event = findEventById(data, info.event.id);
      if (!event) {
        info.revert();
        return;
      }

      const updatedEvent: Event = {
        ...event,
        start: info.event.start!,
        end: info.event.end ?? info.event.start!,
        allDay: info.event.allDay,
      };

      saveEvent(updatedEvent);
    },
    [data, saveEvent]
  );

  return { handleEventClick, handleEventResize, handleEventDrop };
};