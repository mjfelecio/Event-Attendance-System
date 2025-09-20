import { Event } from "@prisma/client";

type Props = {
  event: Event;
  onClick: () => void;
};

const EventCard = ({ event, onClick }: Props) => {
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
          {event.start.toLocaleDateString()} | {event.start.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
