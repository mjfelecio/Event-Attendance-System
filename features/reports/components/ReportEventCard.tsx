import { CalendarDays, Clock, MapPin } from "lucide-react";

import { cn } from "@/globals/libs/shad-cn";
import { Event } from "@/globals/types/events";
import { readableDate } from "@/globals/utils/formatting";
import { capitalizeLabel } from "@/globals/utils/text";
import EventStatusBadge from "./EventStatusBadge";

type Props = {
  event: Event;
  isSelected: boolean;
  onSelect: (event: Event) => void;
};

/**
 * A single selectable event in the reports browser. Rendered as a real
 * <button> (not a clickable div) so it is keyboard-focusable and exposes its
 * selected state via aria-pressed for assistive tech.
 */
const ReportEventCard = ({ event, isSelected, onSelect }: Props) => {
  const start = new Date(event.start);
  const dateTime = event.allDay
    ? `${start.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })} • All day`
    : readableDate(start);

  return (
    <button
      type="button"
      onClick={() => onSelect(event)}
      aria-pressed={isSelected}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
        isSelected
          ? "border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-200"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      )}
    >
      {/* Date pill */}
      <div className="flex w-11 shrink-0 flex-col items-center rounded-lg bg-slate-100 py-1.5 text-slate-700">
        <span className="text-base font-bold leading-none">
          {start.getDate()}
        </span>
        <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          {start.toLocaleDateString("en-US", { month: "short" })}
        </span>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 truncate text-sm font-semibold text-slate-900">
            {event.title}
          </h3>
          <EventStatusBadge status={event.status} className="shrink-0" />
        </div>

        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="size-3.5 shrink-0" />
          <span className="truncate">{dateTime}</span>
        </div>

        {event.location && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        )}

        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
          <CalendarDays className="size-3.5 shrink-0" />
          <span className="truncate">
            {capitalizeLabel(event.category)} Event
          </span>
        </div>
      </div>
    </button>
  );
};

export default ReportEventCard;
