import { Event } from "@/globals/types/events";

/**
 * Filters and sorts events so that only upcoming or ongoing ones remain.
 *
 * - An event is included if its start date is in the future OR its end date is still in the future.
 * - If no end date is provided, it is treated as a single-point event (start only).
 * - Returned events are sorted in ascending order by start date.
 *
 * @param data - Raw events fetched from the API
 * @returns A list of upcoming/ongoing events sorted by soonest start
 */
export function getUpcomingEvents(data?: Event[]): Event[] {
  if (!data) return [];

  const now = new Date();

  return data
    .filter((event) => {
      const start = new Date(event.start);
      const end = event.end ? new Date(event.end) : start;

      return start >= now || end >= now;
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}
