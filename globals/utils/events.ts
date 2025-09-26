import { Event } from "@/globals/types/events";

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
