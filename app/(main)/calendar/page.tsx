import Calendar from "@/features/calendar/components/Calendar";
import EventsContainer from "@/features/calendar/components/EventsContainer";

const CalendarPage = () => {
  return (
    <div className="flex flex-1 bg-white p-8 gap-4 max-h-[680px]">
      <Calendar />
      <EventsContainer />
    </div>
  );
};

export default CalendarPage;
