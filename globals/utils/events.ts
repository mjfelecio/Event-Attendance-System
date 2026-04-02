import { Event, EventForm } from "@/globals/types/events";

/**
 * Filters and sorts events so that only upcoming or ongoing ones remain.
 *
 * Rules:
 * - Include if start date is today or later
 * - Include if end date is today (even if start was before today)
 * - Sort ascending by start date
 */
export function getUpcomingEvents(data?: Event[]): Event[] {
  if (!data) return [];

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return data
    .filter((event) => {
      const start = new Date(event.start);
      const end = event.end ? new Date(event.end) : start;

      return start >= todayStart || end >= todayStart;
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

/**
 * Displays only the date portion of the datetime
 */
export function normalizeAllDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatEventPayload(data: EventForm): EventForm {
  return {
    ...data,
    start: data.allDay ? normalizeAllDay(data.start) : data.start,
    end: data.allDay ? normalizeAllDay(data.end) : data.end,
  };
}

export function toDate(str: string) {
  return new Date(str);
}
