import { CalendarIcon, ClockIcon } from "lucide-react";
import { Event } from "@/globals/types/events";
import { upperCase } from "lodash";

type Props = {
  event: Event;
  onClick: () => void;
};

const EventCard = ({ event, onClick }: Props) => {
  const isPast = new Date(event.end ?? event.start) < new Date();
  const statusStyles: Record<Event["status"], string> = {
    DRAFT: "bg-amber-100 text-amber-800",
    PENDING: "bg-sky-100 text-sky-800",
    APPROVED: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-rose-100 text-rose-800",
  };

  const accentStyles: Record<Event["status"], string> = {
    DRAFT: "bg-amber-500",
    PENDING: "bg-sky-500",
    APPROVED: "bg-emerald-500",
    REJECTED: "bg-rose-500",
  };

  const startDate = event.start.toLocaleDateString();
  const endDate = event.end?.toLocaleDateString();
  const startTime = event.start.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = event.end?.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateDisplay =
    event.end && startDate !== endDate ? `${startDate} -> ${endDate}` : startDate;

  const timeDisplay = !event.allDay
    ? event.end && startTime !== endTime
      ? `${startTime} - ${endTime}`
      : startTime
    : "All day";

  return (
    <div
      onClick={onClick}
      className="group flex min-h-[88px] cursor-pointer overflow-hidden rounded-xl border border-slate-200/80 bg-white transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
    >
      <div className={`w-1.5 shrink-0 ${accentStyles[event.status]}`} />
      <div
        className={`flex flex-1 flex-col p-3 ${
          isPast
            ? "bg-slate-100/90 text-slate-500 hover:bg-slate-200/70"
            : "bg-white hover:bg-slate-50/70"
        }`}
      >
        <h4 className="line-clamp-1 flex-1 truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-slate-700">
          {event.title}
        </h4>

        <div className="mt-1.5 space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CalendarIcon className="h-3 w-3 shrink-0" />
            <span>{dateDisplay}</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ClockIcon className="h-3 w-3 shrink-0" />
              <span>{timeDisplay}</span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide ${statusStyles[event.status]}`}
              >
                {event.status}
              </span>
              <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-indigo-700">
                {upperCase(event.category)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
