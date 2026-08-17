"use client";

import { format } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ARRIVAL_BUCKET_MINUTES,
  CHART_COLORS,
} from "@/globals/constants/attendance";
import type { ArrivalBucket } from "@/globals/types/reports";
import ChartPanel from "@/features/reports/components/charts/ChartPanel";
import {
  TooltipCard,
  axisProps,
  gridProps,
} from "@/features/reports/components/charts/chartTheme";

type ArrivalTimelineChartProps = {
  arrivals: ArrivalBucket[];
  /** Event start, used to mark where the doors opened. */
  start: Date;
  /** All-day events have a midnight start, so the marker is meaningless. */
  allDay: boolean;
};

/**
 * When people actually showed up, in {@link ARRIVAL_BUCKET_MINUTES} buckets.
 *
 * Bars rather than a line: each bucket is a discrete count, and a line would
 * imply arrivals flowed continuously between two sampled points.
 *
 * The event start is drawn as a reference line so the shape is readable as
 * "before/after doors opened" — omitted for all-day events, whose start is
 * normalised to midnight and would put the marker off the left edge.
 */
const ArrivalTimelineChart = ({
  arrivals,
  start,
  allDay,
}: ArrivalTimelineChartProps) => {
  const data = arrivals.map((bucket) => ({
    bucketStart: bucket.bucketStart,
    label: format(new Date(bucket.bucketStart), "h:mm a"),
    count: bucket.count,
  }));

  const startLabel = allDay ? null : format(start, "h:mm a");
  const hasStartMarker =
    !!startLabel && data.some((point) => point.label === startLabel);

  return (
    <ChartPanel
      title="Arrival timeline"
      description={`Time-ins per ${ARRIVAL_BUCKET_MINUTES} minutes.`}
      isEmpty={data.length === 0}
      emptyMessage="Nobody timed in for this event."
      height={260}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 12, bottom: 4, left: -12 }}
        >
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="label" interval="preserveStartEnd" {...axisProps} />
          <YAxis allowDecimals={false} {...axisProps} />
          <Tooltip
            cursor={{ fill: "rgba(15,23,42,0.04)" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const point = payload[0].payload as (typeof data)[number];
              return (
                <TooltipCard
                  label={point.label}
                  rows={[
                    {
                      key: "count",
                      label: "Time-ins",
                      value: point.count,
                      color: CHART_COLORS.primary,
                    },
                  ]}
                />
              );
            }}
          />
          {hasStartMarker ? (
            <ReferenceLine
              x={startLabel}
              stroke={CHART_COLORS.axis}
              strokeDasharray="4 4"
              label={{
                value: "Start",
                position: "top",
                fill: CHART_COLORS.axis,
                fontSize: 11,
              }}
            />
          ) : null}
          <Bar
            dataKey="count"
            fill={CHART_COLORS.primary}
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
};

export default ArrivalTimelineChart;
