import { CalendarIcon, ClockIcon } from "lucide-react";
import { Event } from "@/globals/types/events";
import { capitalize, upperCase } from "lodash";

type Props = {
  event: Event;
  onClick: () => void;
};

const EventCard = ({ event, onClick }: Props) => {
  const isPast = new Date(event.end ?? event.start) < new Date();

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

  // date/time display
  const dateDisplay =
    event.end && startDate !== endDate
      ? `${startDate} → ${endDate}`
      : startDate;

  const timeDisplay = !event.allDay
    ? event.end && startTime !== endTime
      ? `${startTime} – ${endTime}`
      : startTime
    : "All day";

  return (
    <div
      onClick={onClick}
      className="flex flex-row min-h-19 cursor-pointer rounded-md border transition-colors overflow-hidden"
    >
      <div className="w-2 bg-blue-500 shrink-0"></div>
      <div
        className={`flex-1 flex flex-col p-2
        ${
          isPast
            ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
            : "bg-white hover:bg-gray-50"
        }
      `}
      >
        <h4 className="font-medium flex-1 text-sm text-gray-900 group-hover:text-gray-700 line-clamp-1 truncate">
          {event.title}
        </h4>

        <div>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
            <CalendarIcon className="h-3 w-3 shrink-0" />
            <span>{dateDisplay}</span>
          </div>

          <div className="flex justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ClockIcon className="h-3 w-3 shrink-0" />
              <span>{timeDisplay}</span>
            </div>

            <span className="text-[10px] px-2 py-0.5 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              {upperCase(event.category)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
