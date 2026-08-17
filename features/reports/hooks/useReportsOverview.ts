import { useQuery } from "@tanstack/react-query";

import type { EventCategory } from "@prisma/client";
import type { ReportsOverview } from "@/globals/types/reports";
import { fetchApi } from "@/globals/utils/api";
import { queryKeys } from "@/globals/utils/queryKeys";

type UseReportsOverviewArgs = {
  /** Inclusive range start, as `YYYY-MM-DD`. */
  from: string;
  /** Inclusive range end, as `YYYY-MM-DD`. */
  to: string;
  /** Omit for every category. */
  category?: EventCategory;
};

/**
 * Cross-event attendance summary for a date range.
 *
 * The range is passed as `YYYY-MM-DD` strings rather than `Date`s on purpose: a
 * `Date` is a new object every render, so it would never match a cached query key
 * and would refetch forever.
 *
 * Every field in the payload is already a primitive or an ISO string, so unlike
 * {@link useEventReport} there is no transform to apply.
 */
export const useReportsOverview = ({
  from,
  to,
  category,
}: UseReportsOverviewArgs) =>
  useQuery({
    queryKey: queryKeys.reports.overview(from, to, category),
    enabled: !!from && !!to,
    queryFn: async () => {
      const params = new URLSearchParams({ from, to });
      if (category) params.set("category", category);

      return fetchApi<ReportsOverview>(
        `/api/reports/overview?${params.toString()}`,
      );
    },
  });

export default useReportsOverview;
