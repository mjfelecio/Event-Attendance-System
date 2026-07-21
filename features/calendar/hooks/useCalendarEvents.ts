import { useCallback } from "react";
import { EventClickArg, EventDropArg } from "@fullcalendar/core";
import { EventResizeDoneArg } from "@fullcalendar/interaction";
import { Event, EventForm } from "@/globals/types/events";
import { CALENDAR_CONFIG } from "@/features/calendar/constants/calendarConfig";
import { findEventById } from "@/features/calendar/utils/calendar";
import { toastDanger } from "@/globals/components/shared/toasts";

// The save API validates includedGroups as an array of group ids, so a
// calendar move must send ids - not the Group[] relation carried on Event.
const toEventForm = (event: Event, patch: Partial<EventForm>): EventForm => ({
  id: event.id,
  title: event.title,
  location: event.location,
  category: event.category,
  includedGroups: event.includedGroups.map((g) => g.id),
  description: event.description,
  start: event.start,
  end: event.end,
  allDay: event.allDay,
  ...patch,
});

export const useCalendarEvents = (
  data: Event[] | undefined,
  saveEvent: (event: EventForm) => Promise<unknown>,
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

      const updatedEvent = toEventForm(event, {
        start: info.event.start!,
        end: info.event.end ?? info.event.start!,
        allDay: info.event.allDay,
      });

      try {
        await saveEvent(updatedEvent);
      } catch (error) {
        info.revert();
        toastDanger(
          "Couldn't move event",
          error instanceof Error ? error.message : undefined
        );
      }
    },
    [data, saveEvent]
  );

  const handleEventDrop = useCallback(
    async (info: EventDropArg) => {
      if (info.event.id === CALENDAR_CONFIG.DRAFT_EVENT_ID) {
        info.revert();
        return;
      }

      const event = findEventById(data, info.event.id);
      if (!event) {
        info.revert();
        return;
      }

      const updatedEvent = toEventForm(event, {
        start: info.event.start!,
        end: info.event.end ?? info.event.start!,
        allDay: info.event.allDay,
      });

      try {
        await saveEvent(updatedEvent);
      } catch (error) {
        info.revert();
        toastDanger(
          "Couldn't move event",
          error instanceof Error ? error.message : undefined
        );
      }
    },
    [data, saveEvent]
  );

  return { handleEventClick, handleEventResize, handleEventDrop };
};