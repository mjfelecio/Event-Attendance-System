"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {
  EventResizeDoneArg,
} from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg, EventDropArg } from "@fullcalendar/core";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSidebar } from "@/globals/contexts/SidebarContext";
import CalendarEventCard from "./CalendarEventCard";
import useEvents, { useSaveEvent } from "@/globals/hooks/useEvents";
import { Event } from "@/globals/types/events";

type Props = {
  onSelectDate: (start: Date, end: Date) => void;
  isDrawerOpen: boolean;
  onEditEvent?: (event: Event) => void;
};

const Calendar = ({ onSelectDate, isDrawerOpen, onEditEvent }: Props) => {
  const { isExpanded: isSidebarExpanded } = useSidebar();
  const { data } = useEvents();
  const { mutate: saveEvent } = useSaveEvent();

  // We first map the data since FullCalendar has a different format
  const events =
    data?.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
    })) ?? [];

  const calendarRef = useRef<FullCalendar | null>(null);
  const [draftEvent, setDraftEvent] = useState<any | null>(null);

  useEffect(() => {
    setTimeout(() => calendarRef.current?.getApi().updateSize(), 300);
  }, [isSidebarExpanded]);

  useEffect(() => {
    if (!isDrawerOpen) {
      setDraftEvent(null);
    }
  }, [isDrawerOpen]);

  const handleSelectDate = useCallback(
    (info: DateSelectArg) => {
      const isSingleDay = info.end.getDate() - info.start.getDate() === 1;

      const start = new Date(info.startStr);

      // We shift the end by a single day because it is exclusive
      // This is only used for outside components, on FullCalendar, we use the exclusive version
      const end = isSingleDay
        ? new Date(info.startStr)
        : new Date(info.end.getTime() - 1 * 24 * 60 * 60 * 1000);

      setDraftEvent({
        id: "draft",
        start,
        end: info.end, // We use the exclusive version of the event since this is how calendar handles it
        backgroundColor: "oklch(68.5% 0.169 237.323)",
        editable: false,
      });

      onSelectDate(start, end);
    },
    [onSelectDate]
  );

  const handleEventClick = useCallback(
    (info: EventClickArg) => {
      if (info.event.id !== "draft" && onEditEvent) {
        const event = data?.find((e) => e.id === info.event.id);
        if (!event) return;

        onEditEvent(event);
      }
    },
    [onEditEvent]
  );

  const handleEventResize = useCallback(
    async (info: EventResizeDoneArg) => {
      if (info.event.id === "draft") {
        info.revert();
        return;
      }

      const event = data?.find((e) => e.id === info.event.id);
      if (!event) return;

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
      if (info.event.id === "draft") {
        info.revert();
        return;
      }

      const event = data?.find((e) => e.id === info.event.id);
      if (!event) return;

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

  return (
    <div className="rounded-2xl border-2 p-6 overflow-hidden basis-[70%]">
      <FullCalendar
        ref={calendarRef}
        height="100%"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        selectable
        select={handleSelectDate}
        eventClick={handleEventClick}
        eventResize={handleEventResize}
        eventDrop={handleEventDrop}
        events={[...events, ...(draftEvent ? [draftEvent] : [])]}
        slotDuration={"00:30:00"}
        defaultTimedEventDuration={"00:30:00"}
        snapDuration={"00:30:00"}
        editable
        nowIndicator
        validRange={{ start: new Date() }}
        eventContent={(arg) => <CalendarEventCard arg={arg} />}
      />
    </div>
  );
};

export default Calendar;
