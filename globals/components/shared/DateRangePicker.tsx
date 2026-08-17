"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/globals/components/shad-cn/button";
import { Calendar } from "@/globals/components/shad-cn/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/globals/components/shad-cn/popover";
import { cn } from "@/globals/libs/shad-cn";

/** An inclusive date range, as `YYYY-MM-DD` strings. */
export type DateRange = {
  from: string;
  to: string;
};

type DateRangePickerProps = {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
};

/**
 * `YYYY-MM-DD` in the **viewer's** timezone.
 *
 * `toISOString()` would convert to UTC first, which in Philippine time (UTC+8)
 * shifts any date before 08:00 back a day — so "today" would silently become
 * yesterday for most of the school morning. Format from the local parts instead.
 */
export const toDateInput = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

/** Parses a `YYYY-MM-DD` string as local midnight, mirroring {@link toDateInput}. */
export const fromDateInput = (value: string): Date => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/**
 * DateRangePicker
 *
 * Two date popovers that together express an inclusive range. Built from the same
 * `Popover` + shad-cn `Calendar` pairing as
 * `features/calendar/components/DatePicker.tsx`, which handles a single date and
 * is the only date control the app had.
 *
 * ## Why a new component
 * The reports overview is range-scoped and nothing in the app could express a
 * range. Proposed explicitly as a design-system addition rather than assembled
 * ad hoc inside the reports feature, per design-system rule #7.
 *
 * ## Constraints
 * - Values are `YYYY-MM-DD` **strings**, not `Date`s. A `Date` is a new object on
 *   every render, so it can never match a TanStack query key and would refetch
 *   forever. Convert at the edges with {@link fromDateInput} / {@link toDateInput}.
 * - The range is kept coherent: picking a `from` after the current `to` moves `to`
 *   with it, and vice versa, so an inverted range can't be produced.
 *
 * @example
 * ```tsx
 * const [range, setRange] = useState({ from: "2026-08-10", to: "2026-08-17" });
 * <DateRangePicker value={range} onChange={setRange} />
 * ```
 */
const DateRangePicker = ({
  value,
  onChange,
  className,
}: DateRangePickerProps) => {
  const [openField, setOpenField] = useState<"from" | "to" | null>(null);

  const from = fromDateInput(value.from);
  const to = fromDateInput(value.to);

  const handleSelect = (field: "from" | "to") => (picked: Date | undefined) => {
    if (!picked) return;
    const next = toDateInput(picked);

    // Dragging one end past the other would produce an inverted range the API
    // rejects with a 400. Push the other end along instead of erroring at the user.
    onChange(
      field === "from"
        ? { from: next, to: next > value.to ? next : value.to }
        : { from: next < value.from ? next : value.from, to: next },
    );
    setOpenField(null);
  };

  const field = (key: "from" | "to", label: string, date: Date) => (
    <Popover
      open={openField === key}
      onOpenChange={(open) => setOpenField(open ? key : null)}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-label={`${label} date`}
          className="h-9 w-full justify-start gap-2 border-slate-300 bg-white text-left text-sm font-medium text-slate-700 sm:w-auto"
        >
          <CalendarIcon className="h-4 w-4" />
          {format(date, "MMM d, yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[60] w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect(key)}
          required
        />
      </PopoverContent>
    </Popover>
  );

  return (
    <div
      className={cn("flex flex-col gap-2 sm:flex-row sm:items-center", className)}
    >
      {field("from", "Start", from)}
      <span className="hidden text-sm text-slate-500 sm:inline">to</span>
      {field("to", "End", to)}
    </div>
  );
};

export default DateRangePicker;
