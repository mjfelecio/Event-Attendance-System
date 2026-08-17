"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CHART_COLORS } from "@/globals/constants/attendance";
import type { CategorySummary } from "@/globals/types/reports";
import { capitalizeLabel } from "@/globals/utils/text";
import ChartPanel from "@/features/reports/components/charts/ChartPanel";
import {
  TooltipCard,
  axisProps,
  gridProps,
  percent,
} from "@/features/reports/components/charts/chartTheme";

type CategoryChartProps = {
  byCategory: CategorySummary[];
};

/**
 * Average turnout by event scope.
 *
 * Horizontal bars, because the job is comparing magnitudes across named
 * categories and the names are long enough that vertical bars would need rotated
 * ticks. Single series, so no legend; the value is direct-labelled at each bar's
 * end rather than left to the reader's eye against the axis.
 */
const CategoryChart = ({ byCategory }: CategoryChartProps) => {
  const data = byCategory
    .filter((entry) => entry.averageRate !== null)
    .map((entry) => ({
      category: entry.category,
      label: capitalizeLabel(entry.category),
      rate: entry.averageRate as number,
      events: entry.events,
    }))
    .sort((a, b) => b.rate - a.rate);

  return (
    <ChartPanel
      title="Turnout by scope"
      description="Average rate per event category."
      isEmpty={data.length === 0}
      emptyMessage="No categories with eligible students in this range."
      height={Math.max(200, data.length * 44 + 40)}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 48, bottom: 4, left: 8 }}
        >
          <CartesianGrid {...gridProps} vertical horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(value: number) => `${value}%`}
            {...axisProps}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={110}
            {...axisProps}
          />
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
                      key: "rate",
                      label: "Average turnout",
                      value: percent(point.rate),
                      color: CHART_COLORS.primary,
                    },
                    {
                      key: "events",
                      label: "Events",
                      value: point.events,
                    },
                  ]}
                />
              );
            }}
          />
          <Bar
            dataKey="rate"
            fill={CHART_COLORS.primary}
            radius={[0, 4, 4, 0]}
            barSize={20}
            // A report is read, not watched. Animation also makes the rendered
            // output non-deterministic for screenshots and print.
            isAnimationActive={false}
          >
            <LabelList
              dataKey="rate"
              position="right"
              formatter={(value) =>
                typeof value === "number" ? percent(value) : ""
              }
              fill={CHART_COLORS.axis}
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
};

export default CategoryChart;
