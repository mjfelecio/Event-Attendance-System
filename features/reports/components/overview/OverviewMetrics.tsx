"use client";

import Link from "next/link";
import { format } from "date-fns";
import { FaRegCalendarCheck, FaUserGroup } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { VscPercentage } from "react-icons/vsc";

import DataCard from "@/features/attendance/components/DataCard";
import StatusBadge from "@/globals/components/shared/StatusBadge";
import { surface } from "@/globals/constants/designTokens";
import type { OverviewEvent, ReportsOverview } from "@/globals/types/reports";
import { percent } from "@/features/reports/components/charts/chartTheme";

type OverviewMetricsProps = {
  overview?: ReportsOverview;
  isLoading: boolean;
};

const Highlight = ({
  label,
  tone,
  event,
}: {
  label: string;
  tone: "success" | "danger";
  event: OverviewEvent;
}) => (
  <Link
    href={`/reports/events/${event.id}`}
    className={`${surface.cardInteractive} flex flex-col gap-2 p-4`}
  >
    <div className="flex items-center gap-2">
      <StatusBadge tone={tone} withDot>
        {label}
      </StatusBadge>
      <span className="ml-auto text-lg font-semibold text-slate-900">
        {percent(event.rate)}
      </span>
    </div>
    <p className="line-clamp-1 text-sm font-medium text-slate-900">
      {event.title}
    </p>
    <p className="text-xs text-slate-500">
      {format(new Date(event.start), "MMM d, yyyy")} · {event.present} of{" "}
      {event.eligible} attended
    </p>
  </Link>
);

/**
 * The headline numbers for a date range, plus the best and worst attended events.
 *
 * Reuses `DataCard` from the attendance feature — the one documented cross-feature
 * component import in the app, and already what the reports pages used.
 */
const OverviewMetrics = ({ overview, isLoading }: OverviewMetricsProps) => {
  const totals = overview?.totals;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DataCard
          label="Events held"
          description="Approved events in range"
          icon={FaRegCalendarCheck}
          value={String(totals?.events ?? 0)}
          isLoading={isLoading}
        />
        <DataCard
          label="Average turnout"
          description="Mean rate per event"
          icon={VscPercentage}
          value={percent(totals?.averageRate)}
          isLoading={isLoading}
        />
        <DataCard
          label="Attendances"
          description="Time-ins recorded"
          icon={IoMdCheckmarkCircleOutline}
          value={String(totals?.presentSum ?? 0)}
          isLoading={isLoading}
        />
        <DataCard
          label="Eligible slots"
          description="Across all events"
          icon={FaUserGroup}
          value={String(totals?.eligibleSum ?? 0)}
          isLoading={isLoading}
        />
      </div>

      {/* Only worth showing once there are two events to compare. */}
      {overview?.best &&
      overview?.worst &&
      overview.best.id !== overview.worst.id ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Highlight label="Best attended" tone="success" event={overview.best} />
          <Highlight
            label="Least attended"
            tone="danger"
            event={overview.worst}
          />
        </div>
      ) : null}
    </div>
  );
};

export default OverviewMetrics;
