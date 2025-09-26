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
  const colors = {
    bg: "bg-blue-500",
    bar: "bg-blue-700",
    accent: "bg-blue-600",
    textMain: "text-white",
    textSub: "text-slate-100",
  };

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
        className={`flex flex-1 flex-row gap-1 px-1 py-0.5 items-center rounded-md transition-colors overflow-hidden ${
          isPast ? "opacity-50" : ""
        }`}
      >
        {/* Bullet indicator */}
        <div className={`size-2 rounded-full shrink-0 ${colors.bar}`} />

        {/* Text content */}
        <div className="flex-1 flex flex-row gap-1 items-center min-w-0">
          {cleanTimeText && (
            <p
              className={`text-xs whitespace-nowrap ${fadeIfPast(
                "text-gray-500",
                isPast,
                40
              )}`}
            >
              {cleanTimeText}
            </p>
          )}
          <p
            className={`font-medium text-xs truncate ${fadeIfPast(
              "text-gray-700",
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
