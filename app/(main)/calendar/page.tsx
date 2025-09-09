import Calendar from "@/features/calendar/components/Calendar";
import React from "react";

const CalendarPage = () => {
  return (
    <div className="flex flex-1 bg-white p-8 gap-4">
      {/* Calendar Part */}
      <Calendar />

      {/* Event View */}
      <div className="border-2 rounded-xl p-4 overflow-hidden basis-[30%] flex flex-col gap-4 max-h-[600px]">
        <h1 className="text-2xl text-center font-bold">Upcoming Events</h1>

				<div className="border-2 border-gray-300 rounded-xl overflow-scroll">
            {Array(100).fill(0).map((item, index) => (
              <div key={index} className="bg-white rounded-sm py-1 px-3">
                <p>Sample Event {index}</p>
              </div>
            ))}
        </div>

				<button>Add Event</button>
      </div>
    </div>
  );
};

export default CalendarPage;
