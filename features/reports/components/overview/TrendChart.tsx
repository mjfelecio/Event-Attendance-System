"use client";

import { format } from "date-fns";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CHART_COLORS } from "@/globals/constants/attendance";
import type { OverviewEvent } from "@/globals/types/reports";
import ChartPanel from "@/features/reports/components/charts/ChartPanel";
import {
  TooltipCard,
  axisProps,
  gridProps,
  percent,
} from "@/features/reports/components/charts/chartTheme";

type TrendChartProps = {
  events: OverviewEvent[];
};

/**
 * Turnout per event over the selected range.
 *
 * A line, because the job is change-over-time across an ordered sequence. Single
 * series, so no legend — the panel title names it (`dataviz`: a legend box for one
 * series is noise).
 *
 * Events nobody was eligible for have no rate and are dropped rather than plotted
 * as 0%, which would invent a turnout collapse that never happened.
 */
const TrendChart = ({ events }: TrendChartProps) => {
  const data = events
    .filter((event) => event.rate !== null)
    .map((event) => ({
      id: event.id,
      title: event.title,
      start: event.start,
      label: format(new Date(event.start), "MMM d"),
      rate: event.rate as number,
      present: event.present,
      eligible: event.eligible,
    }))
    // The API returns newest-first for the table; a trend must read left to right.
    .sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
    );

  return (
    <ChartPanel
      title="Turnout over time"
      description="Attendance rate for each event in the selected range."
      isEmpty={data.length === 0}
      emptyMessage="No events with eligible students in this range."
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -8 }}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="label" {...axisProps} />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(value: number) => `${value}%`}
            {...axisProps}
          />
          <Tooltip
            cursor={{ stroke: CHART_COLORS.grid }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const point = payload[0].payload as (typeof data)[number];
              return (
                <TooltipCard
                  label={point.title}
                  rows={[
                    {
                      key: "rate",
                      label: "Turnout",
                      value: percent(point.rate),
                      color: CHART_COLORS.primary,
                    },
                    {
                      key: "counts",
                      label: "Attended",
                      value: `${point.present} of ${point.eligible}`,
                    },
                    {
                      key: "date",
                      label: "Date",
                      value: format(new Date(point.start), "MMM d, yyyy"),
                    },
                  ]}
                />
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="rate"
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            dot={{ r: 4, fill: CHART_COLORS.primary, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: CHART_COLORS.primary, stroke: "#fff", strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
};

export default TrendChart;
