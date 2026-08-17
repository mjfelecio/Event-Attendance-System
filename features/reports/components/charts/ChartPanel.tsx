"use client";

import type { ReactNode } from "react";

import { surface, type as typeToken } from "@/globals/constants/designTokens";
import { cn } from "@/globals/libs/shad-cn";

type ChartPanelProps = {
  title: string;
  description?: string;
  /**
   * Rendered instead of the chart when there is nothing to plot. An empty chart
   * frame with axes and no marks reads as "loading" or "broken"; a sentence reads
   * as "nothing happened".
   */
  isEmpty?: boolean;
  emptyMessage?: string;
  /** Chart height in px. Recharts' ResponsiveContainer needs a sized parent. */
  height?: number;
  /** Right-aligned slot for a legend or a small control. */
  trailing?: ReactNode;
  children: ReactNode;
  className?: string;
};

/**
 * ChartPanel
 *
 * The shared frame every report chart sits in — `surface.card`, a section title,
 * an optional one-line description, and a fixed-height plot area.
 *
 * ## Why the plot area scrolls horizontally
 * The design system's hard rule is that the page body never scrolls sideways;
 * wide content scrolls inside its own container. A bar chart with many categories
 * is exactly that case, so the plot area owns an `overflow-x-auto` and a min-width
 * rather than letting bars compress to slivers on a phone.
 *
 * @see docs/design-system.md — "Responsive guidance"
 */
const ChartPanel = ({
  title,
  description,
  isEmpty = false,
  emptyMessage = "No data for this range.",
  height = 260,
  trailing,
  children,
  className,
}: ChartPanelProps) => (
  <section className={cn(surface.card, "flex flex-col gap-4 p-5", className)}>
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className={typeToken.sectionTitle}>{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>
      {trailing}
    </header>

    {isEmpty ? (
      <div
        className="flex items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500"
        style={{ height }}
      >
        {emptyMessage}
      </div>
    ) : (
      <div className="overflow-x-auto">
        <div style={{ height }} className="min-w-[320px]">
          {children}
        </div>
      </div>
    )}
  </section>
);

export default ChartPanel;
