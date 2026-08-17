"use client";

import StatusBadge from "@/globals/components/shared/StatusBadge";
import { surface } from "@/globals/constants/designTokens";
import type { ReportTotals } from "@/globals/types/reports";

type DataQualityStripProps = {
  totals: ReportTotals;
};

/**
 * How the attendance was captured — scanned versus hand-entered.
 *
 * `Record.method` has been stored since the schema's first version and surfaced
 * in no UI at all. It matters for reading a report honestly: a high share of
 * manual entries means the scanner wasn't working (or wasn't used), which is
 * exactly the context someone questioning the numbers needs.
 */
const DataQualityStrip = ({ totals }: DataQualityStripProps) => {
  if (totals.attended === 0) return null;

  const manualShare = (totals.manual / totals.attended) * 100;

  return (
    <div
      className={`${surface.card} flex flex-wrap items-center gap-3 px-5 py-4`}
    >
      <span className="text-sm font-medium text-slate-700">
        How attendance was recorded
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge tone="primary">Scanned: {totals.scanned}</StatusBadge>
        <StatusBadge tone="neutral">Manual: {totals.manual}</StatusBadge>
      </div>
      {/* Worth calling out only when hand-entry dominated. */}
      {manualShare >= 25 ? (
        <p className="text-xs text-slate-500">
          {manualShare.toFixed(0)}% of attendance was entered manually.
        </p>
      ) : null}
    </div>
  );
};

export default DataQualityStrip;
