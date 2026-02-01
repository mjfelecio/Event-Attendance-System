"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import React, { useMemo, useRef } from "react";
import { useSidebar } from "@/globals/contexts/SidebarContext";
import CalendarEventCard from "@/features/calendar/components/CalendarEventCard";
import useEvents, { useSaveEvent } from "@/globals/hooks/useEvents";
import { CalendarProps } from "@/features/calendar/types/calendar";
import {
  CALENDAR_CONFIG,
  CALENDAR_HEADER_TOOLBAR,
} from "@/features/calendar/constants/calendarConfig";
import { transformEventsForCalendar } from "@/features/calendar/utils/calendar";
import { useCalendarResize } from "@/features/calendar/hooks/useCalendarResize";
import { useDraftEvent } from "@/features/calendar/hooks/useDraftEvent";
import { useCalendarEvents } from "@/features/calendar/hooks/useCalendarEvents";

const Calendar = ({
  onSelectDate,
  isDrawerOpen,
  onEditEvent,
}: CalendarProps) => {
  const { isExpanded: isSidebarExpanded } = useSidebar();
  const { data } = useEvents();
  const { mutate: saveEvent } = useSaveEvent();
  const calendarRef = useRef<FullCalendar | null>(null);

  // Transform events for FullCalendar format
  const transformedEvents = useMemo(
    () => transformEventsForCalendar(data || []),
    [data]
  );

  // Custom hooks for managing component behavior
  useCalendarResize(calendarRef, isSidebarExpanded);

  const { draftEvent, handleSelectDate } = useDraftEvent(
    isDrawerOpen,
    onSelectDate
  );

  const { handleEventClick, handleEventResize, handleEventDrop } =
    useCalendarEvents(data, saveEvent, onEditEvent);

  // Combine transformed events with draft event
  const allEvents = useMemo(
    () => [...transformedEvents, ...(draftEvent ? [draftEvent] : [])],
    [transformedEvents, draftEvent]
  );

  return (
    <div className="rounded-2xl border-2 p-4 md:p-6 overflow-hidden w-full h-full">
      <FullCalendar
        ref={calendarRef}
        height="100%"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={CALENDAR_HEADER_TOOLBAR}
        selectable
        select={handleSelectDate}
        eventClick={handleEventClick}
        eventResize={handleEventResize}
        eventDrop={handleEventDrop}
        events={allEvents}
        slotDuration={CALENDAR_CONFIG.SLOT_DURATION}
        defaultTimedEventDuration={CALENDAR_CONFIG.DEFAULT_TIMED_EVENT_DURATION}
        snapDuration={CALENDAR_CONFIG.SNAP_DURATION}
        editable
        nowIndicator
        validRange={{ start: new Date() }}
        eventContent={(arg) => <CalendarEventCard arg={arg} />}
      />
    </div>
  );
};

export default Calendar;
