"use client";

import type { ReactNode } from "react";

import { CHART_COLORS } from "@/globals/constants/attendance";

/**
 * Shared Recharts styling, so four charts don't drift into four grid colours.
 *
 * Axes and grid are deliberately recessive — the marks carry the message. Text
 * wears slate ink, never a series colour.
 */
export const axisProps = {
  stroke: CHART_COLORS.axis,
  tick: { fill: CHART_COLORS.axis, fontSize: 12 },
  tickLine: false,
  axisLine: { stroke: CHART_COLORS.grid },
} as const;

export const gridProps = {
  stroke: CHART_COLORS.grid,
  strokeDasharray: "3 3",
  /** Horizontal rules only; vertical ones add noise without aiding comparison. */
  vertical: false,
} as const;

/**
 * A tooltip styled like the app's surfaces rather than Recharts' default.
 *
 * Recharts' payload typing is loose across versions, so this takes already
 * formatted rows and does no digging of its own.
 */
export const TooltipCard = ({
  label,
  rows,
}: {
  label: ReactNode;
  rows: { key: string; label: string; value: ReactNode; color?: string }[];
}) => (
  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg">
    <p className="font-semibold text-slate-900">{label}</p>
    <ul className="mt-1 space-y-0.5">
      {rows.map((row) => (
        <li key={row.key} className="flex items-center gap-2 text-slate-600">
          {row.color ? (
            <span
              aria-hidden
              className="size-2 rounded-full"
              style={{ backgroundColor: row.color }}
            />
          ) : null}
          <span>{row.label}</span>
          <span className="ml-auto font-medium text-slate-900">{row.value}</span>
        </li>
      ))}
    </ul>
  </div>
);

/** Percentage formatted for an axis tick or a tooltip. */
export const percent = (value: number | null | undefined): string =>
  value === null || value === undefined ? "—" : `${value.toFixed(1)}%`;
