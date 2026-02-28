import { EventContentArg } from "@fullcalendar/core";
import React from "react";

/** Helper to fade Tailwind colors when past */
const fadeIfPast = (color: string, isPast: boolean, opacity: number) => {
  return isPast ? `${color}/${opacity}` : color;
};

const CalendarEventCard = ({ arg }: { arg: EventContentArg }) => {
  // Clean up trailing dash for drafts
  const cleanTimeText = arg.timeText.replace(/\s*-\s*$/, "");
  const isAllDay = arg.event.allDay;
  const isPast = arg.isPast;

  /** Shared styles */
  const status =
    arg.event.id === "draft"
      ? "DRAFT"
      : (arg.event.extendedProps?.status as string | undefined) ?? "APPROVED";
  const statusColors: Record<string, {
    bg: string;
    bar: string;
    accent: string;
    textMain: string;
    textSub: string;
    monthBg: string;
    monthBorder: string;
    monthText: string;
    monthTime: string;
  }> = {
    DRAFT: {
      bg: "bg-orange-500",
      bar: "bg-orange-700",
      accent: "bg-orange-600",
      textMain: "text-white",
      textSub: "text-orange-100",
      monthBg: "bg-orange-50",
      monthBorder: "border-orange-200",
      monthText: "text-orange-900",
      monthTime: "text-orange-700",
    },
    PENDING: {
      bg: "bg-sky-500",
      bar: "bg-sky-700",
      accent: "bg-sky-600",
      textMain: "text-white",
      textSub: "text-sky-100",
      monthBg: "bg-sky-50",
      monthBorder: "border-sky-200",
      monthText: "text-sky-900",
      monthTime: "text-sky-700",
    },
    APPROVED: {
      bg: "bg-emerald-500",
      bar: "bg-emerald-700",
      accent: "bg-emerald-600",
      textMain: "text-white",
      textSub: "text-emerald-100",
      monthBg: "bg-emerald-50",
      monthBorder: "border-emerald-200",
      monthText: "text-emerald-900",
      monthTime: "text-emerald-700",
    },
    REJECTED: {
      bg: "bg-rose-500",
      bar: "bg-rose-700",
      accent: "bg-rose-600",
      textMain: "text-white",
      textSub: "text-rose-100",
      monthBg: "bg-rose-50",
      monthBorder: "border-rose-200",
      monthText: "text-rose-900",
      monthTime: "text-rose-700",
    },
  };

  const colors = statusColors[status] ?? statusColors.APPROVED;

  /** All-day events */
  if (isAllDay) {
    return (
      <div
        className={`flex h-full w-full flex-row ${fadeIfPast(
          colors.bg,
          isPast,
          50
        )} overflow-hidden`}
      >
        <div className={`${colors.bar} w-1.5 shrink-0`} />
        <div className="flex flex-col justify-center items-start px-1 py-0.5">
          <p
            className={`font-semibold text-xs truncate ${fadeIfPast(
              colors.textMain,
              isPast,
              40
            )}`}
          >
            {arg.event.title}
          </p>
        </div>
      </div>
    );
  }

  /** Month view */
  if (arg.view.type === "dayGridMonth") {
    return (
      <div
        className={`flex w-full flex-1 flex-row items-center gap-1 overflow-hidden rounded-md border px-1.5 py-0.5 transition-colors ${
          colors.monthBg
        } ${colors.monthBorder} ${
          isPast ? "opacity-50" : ""
        }`}
      >
        {/* Bullet indicator */}
        <div className={`size-2 rounded-full shrink-0 ${colors.bar}`} />

        {/* Text content */}
        <div className="flex-1 flex flex-row gap-1 items-center min-w-0">
          {cleanTimeText && (
            <p
              className={`text-[11px] whitespace-nowrap font-semibold ${fadeIfPast(
                colors.monthTime,
                isPast,
                40
              )}`}
            >
              {cleanTimeText}
            </p>
          )}
          <p
            className={`truncate text-[11px] font-semibold ${fadeIfPast(
              colors.monthText,
              isPast,
              50
            )}`}
          >
            {arg.event.title}
          </p>
        </div>
      </div>
    );
  }

  /** TimeGrid / Week / Day views */
  return (
    <div
      className={`flex w-full h-full flex-row justify-start items-start ${fadeIfPast(
        colors.bg,
        isPast,
        50
      )} overflow-hidden`}
    >
      <div className={`${colors.bar} h-full w-1.5 shrink-0`} />

      <div className="flex flex-1 flex-col px-1 py-0.5 h-full overflow-hidden">
        {/* Title */}
        <p
          className={`font-semibold text-xs leading-tight line-clamp-2 overflow-hidden ${fadeIfPast(
            colors.textMain,
            isPast,
            40
          )}`}
        >
          {arg.event.title}
        </p>

        {/* Time */}
        {cleanTimeText && (
          <p
            className={`text-[10px] font-medium truncate ${fadeIfPast(
              colors.textSub,
              isPast,
              30
            )}`}
          >
            {cleanTimeText}
          </p>
        )}
      </div>
    </div>
  );
};

export default CalendarEventCard;
