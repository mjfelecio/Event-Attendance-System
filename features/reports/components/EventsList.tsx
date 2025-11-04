"use client";

import EventCard from "@/features/calendar/components/EventCard";
import useEvents from "@/globals/hooks/useEvents";
import { Event } from "@/globals/types/events";
import { Loader2 } from "lucide-react";
import React from "react";

const EventsList = () => {
  const { data: events, isLoading, error } = useEvents();

  const handleEventClick = (event: Event) => {
    alert(`Opened ${event.title} event`);
  };

  return (
    <div className="border-2 border-gray-300 rounded-md w-96 h-full">
      <h1 className="text-xl md:text-2xl text-center font-bold my-2">Events</h1>
      {/* Upcoming Events List */}
      <div className="p-2 flex flex-col gap-2 h-[400px] md:h-[420px] rounded-xl overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
            <span className="ml-2 text-lg">Loading events...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-red-600">
            <p className="font-medium">Failed to load events.</p>
            <span className="text-sm">Try refreshing the page</span>
          </div>
        ) : events?.length ? (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => handleEventClick(event)}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No upcoming events</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsList;
