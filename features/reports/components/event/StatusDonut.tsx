"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { CHART_COLORS } from "@/globals/constants/attendance";
import type { ReportTotals } from "@/globals/types/reports";
import ChartPanel from "@/features/reports/components/charts/ChartPanel";
import { TooltipCard } from "@/features/reports/components/charts/chartTheme";

type StatusDonutProps = {
  totals: ReportTotals;
};

/**
 * How the eligible roster split across present / late / absent.
 *
 * A donut is defensible here only because it is a true part-to-whole with three
 * slices that sum to the eligible count. Anything more than a handful of slices
 * would need a bar chart instead.
 *
 * **The legend is mandatory, not decorative.** These three fills are the app's
 * status palette, and `late` (amber-500) sits below the 3:1 contrast bar against
 * white — the `dataviz` validator flags it as needing "visible labels or a table
 * view" as relief. The labelled counts below the chart are that relief, and they
 * also mean identity never rests on colour alone for a colourblind reader.
 *
 * @see globals/constants/attendance.ts — CHART_COLORS and the contrast obligation
 */
const StatusDonut = ({ totals }: StatusDonutProps) => {
  const slices = [
    { key: "present", label: "Present", value: totals.present, color: CHART_COLORS.present },
    { key: "late", label: "Late", value: totals.late, color: CHART_COLORS.late },
    { key: "absent", label: "Absent", value: totals.absent, color: CHART_COLORS.absent },
  ];

  const share = (value: number) =>
    totals.eligible > 0
      ? `${((value / totals.eligible) * 100).toFixed(1)}%`
      : "—";

  return (
    <ChartPanel
      title="Attendance breakdown"
      description="How the eligible roster split on the day."
      isEmpty={totals.eligible === 0}
      emptyMessage="No students were eligible for this event."
      height={300}
    >
      <div className="flex h-full flex-col items-center gap-4 sm:flex-row">
        <div className="h-[180px] w-full sm:h-full sm:flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices.filter((slice) => slice.value > 0)}
                dataKey="value"
                nameKey="label"
                innerRadius="58%"
                outerRadius="85%"
                // A small gap keeps adjacent fills from reading as one shape.
                paddingAngle={2}
                stroke="#fff"
                strokeWidth={2}
                isAnimationActive={false}
              >
                {slices
                  .filter((slice) => slice.value > 0)
                  .map((slice) => (
                    <Cell key={slice.key} fill={slice.color} />
                  ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const point = payload[0].payload as (typeof slices)[number];
                  return (
                    <TooltipCard
                      label={point.label}
                      rows={[
                        {
                          key: "count",
                          label: "Students",
                          value: point.value,
                          color: point.color,
                        },
                        {
                          key: "share",
                          label: "Share",
                          value: share(point.value),
                        },
                      ]}
                    />
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* The required label relief — never colour alone. */}
        <ul className="flex w-full flex-col gap-2 sm:w-44">
          {slices.map((slice) => (
            <li key={slice.key} className="flex items-center gap-2 text-sm">
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-slate-600">{slice.label}</span>
              <span className="ml-auto font-semibold text-slate-900">
                {slice.value}
              </span>
              <span className="w-14 text-right text-xs text-slate-500">
                {share(slice.value)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </ChartPanel>
  );
};

export default StatusDonut;
