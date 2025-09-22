import { Event } from "@/globals/types/events";

type Props = {
  event: Event;
  onClick: () => void;
};

const EventCard = ({ event, onClick }: Props) => {
  const dateTimeString = `${event.start.toLocaleDateString()} | ${event.start.toLocaleTimeString()}`;
  const dateString = `${event.start.toLocaleDateString()}`;

  return (
    <div
      onClick={onClick}
      className="bg-gray-50 hover:bg-gray-100 rounded-sm py-2 px-3"
    >
      <div>
        <h4>{event.title}</h4>
      </div>
      <div>
        <p className="text-xs">
          {event.allDay ? dateString : dateTimeString}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
