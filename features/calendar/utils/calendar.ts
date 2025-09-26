import { Event } from "@/globals/types/events";
import { CALENDAR_CONFIG } from "@/features/calendar/constants/calendarConfig";
import { CalendarEvent, DraftEvent } from "@/features/calendar/types/calendar";

export const transformEventsForCalendar = (events: Event[]): CalendarEvent[] => {
  return events?.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    allDay: event.allDay,
  })) ?? [];
};

export const calculateEndDate = (start: Date, end: Date, isSingleDay: boolean): Date => {
  return isSingleDay
    ? new Date(start.toISOString())
    : new Date(end.getTime() - CALENDAR_CONFIG.MILLISECONDS_PER_DAY);
};

export const createDraftEvent = (start: Date, end: Date): DraftEvent => {
  return {
    id: CALENDAR_CONFIG.DRAFT_EVENT_ID,
    start,
    end,
    backgroundColor: CALENDAR_CONFIG.DRAFT_EVENT_COLOR,
    editable: false,
  };
};

export const findEventById = (events: Event[] | undefined, id: string): Event | null => {
  if (!events) return null;
  
  const event = events.find((e) => e.id === id);
  if (!event) {
    console.warn(`Event with id ${id} not found`);
    return null;
  }
  return event;
};