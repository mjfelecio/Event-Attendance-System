"use client";

import { FaUserGroup } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineTimer, MdOutlinePersonOff } from "react-icons/md";
import { VscPercentage } from "react-icons/vsc";

import DataCard from "@/features/attendance/components/DataCard";
import type { ReportTotals } from "@/globals/types/reports";
import { percent } from "@/features/reports/components/charts/chartTheme";

type ReportMetricsProps = {
  totals?: ReportTotals;
  rate?: number | null;
  /** Whether this event collected time-outs at all. */
  expectsTimeout?: boolean;
  isLoading: boolean;
};

/**
 * The headline numbers for one event.
 *
 * The "Late" card appears whenever the event can express lateness, and the
 * "No time-out" card only when the event actually collected time-outs — showing a
 * hard zero for a time-in-only event would imply a problem that doesn't exist.
 */
const ReportMetrics = ({
  totals,
  rate,
  expectsTimeout = false,
  isLoading,
}: ReportMetricsProps) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <DataCard
      label="Attendance rate"
      description="Attended of eligible"
      icon={VscPercentage}
      value={percent(rate)}
      isLoading={isLoading}
    />
    <DataCard
      label="Present"
      description="Timed in on time"
      icon={IoMdCheckmarkCircleOutline}
      value={String(totals?.present ?? 0)}
      isLoading={isLoading}
    />
    <DataCard
      label="Late"
      description="Timed in after the grace period"
      icon={MdOutlineTimer}
      value={String(totals?.late ?? 0)}
      isLoading={isLoading}
    />
    <DataCard
      label="Absent"
      description="No attendance recorded"
      icon={MdOutlinePersonOff}
      value={String(totals?.absent ?? 0)}
      isLoading={isLoading}
    />
    <DataCard
      label="Eligible"
      description="Students in scope"
      icon={FaUserGroup}
      value={String(totals?.eligible ?? 0)}
      isLoading={isLoading}
    />
    {expectsTimeout ? (
      <DataCard
        label="No time-out"
        description="Timed in but never out"
        icon={MdOutlineTimer}
        value={String(totals?.noTimeout ?? 0)}
        isLoading={isLoading}
      />
    ) : null}
  </div>
);

export default ReportMetrics;
