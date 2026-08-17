import { useQuery } from "@tanstack/react-query";

import type { EventReport, EventReportAPI } from "@/globals/types/reports";
import { fetchApi } from "@/globals/utils/api";
import { queryKeys } from "@/globals/utils/queryKeys";

/**
 * Converts the wire format's ISO strings back into real `Date`s.
 *
 * Only the event's own timestamps are converted. Row timestamps stay as strings —
 * that matches `useAllRecordsFromEvent`, whose table columns parse per cell, and
 * avoids walking a roster-sized array on every render.
 *
 * @see globals/hooks/useEvents.ts — `transformEvent`, the pattern this follows
 */
const transformReport = (report: EventReportAPI): EventReport => ({
  ...report,
  event: {
    ...report.event,
    start: new Date(report.event.start),
    end: new Date(report.event.end),
    createdAt: new Date(report.event.createdAt),
    updatedAt: new Date(report.event.updatedAt),
    reviewedAt: report.event.reviewedAt
      ? new Date(report.event.reviewedAt)
      : null,
  },
});

/**
 * One event's full attendance report.
 *
 * Deliberately does **not** poll. A completed event's data doesn't change every
 * eight seconds, and a report that reshuffles under the reader is worse than a
 * stale one (`docs/conventions.md`).
 */
export const useEventReport = (eventId?: string) =>
  useQuery({
    queryKey: queryKeys.reports.event(eventId!),
    enabled: !!eventId,
    queryFn: async () =>
      transformReport(
        await fetchApi<EventReportAPI>(`/api/reports/events/${eventId}`),
      ),
  });

export default useEventReport;
