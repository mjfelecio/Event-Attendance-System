import { CalendarIcon, ClockIcon } from "lucide-react";
import { Event } from "@/globals/types/events";

type Props = {
  event: Event;
  onClick: () => void;
};

const EventCard = ({ event, onClick }: Props) => {
  const isPast = new Date(event.end ?? event.start) < new Date();
  
  const startDate = new Date(event.start).toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
  
  const timeDisplay = event.allDay 
    ? "All day" 
    : new Date(event.start).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

  return (
    <div 
      onClick={onClick}
      className={`flex gap-3 p-2.5 rounded-lg transition-all cursor-pointer hover:shadow-sm ${
        isPast 
          ? 'bg-gray-50 border-gray-200 text-gray-500' 
          : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      {/* Date pill */}
      <div className="flex flex-col items-center w-12 shrink-0">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600">
          {new Date(event.start).getDate()}
        </div>
        <span className="text-xs mt-1 text-gray-500 leading-tight">
          {startDate.split(', ')[0]}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm mb-1 line-clamp-1 text-gray-900">
          {event.title}
        </h4>
        
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
          <CalendarIcon className="h-3 w-3" />
          <span>{startDate}</span>
        </div>
        
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <ClockIcon className="h-3 w-3" />
          <span>{timeDisplay}</span>
        </div>
      </div>

      {/* Category badge */}
      <span className={`py-1 px-2 h-6 flex items-center justify-center rounded-full text-[10px] font-medium ${
        isPast 
          ? 'bg-gray-200 text-gray-500' 
          : 'bg-blue-100 text-blue-700'
      }`}>
        {event.category}
      </span>
    </div>
  );
};

export default EventCard;
