"use client";

import EventCard from "@/globals/components/shared/EventCard";
import useEvents from "@/globals/hooks/useEvents";
import { Event } from "@/globals/types/events";
import { Loader2 } from "lucide-react";
import React, { useCallback } from "react";

type Props = {
  selectedEvent: Event | null;
  onSelectEvent: (event: Event) => void;
};

const EventsList = ({ selectedEvent, onSelectEvent }: Props) => {
  const { data: events, isLoading, error } = useEvents();

  const handleEventClick = useCallback((event: Event) => {
    onSelectEvent(event);
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] basis-[30%] border-2 border-gray-300 rounded-md overflow-hidden">
      {/* Header */}
      <div className="bg-slate-200">
        <h1 className="text-xl md:text-2xl text-center font-bold py-2">
          Events
        </h1>
      </div>

      {/* Upcoming Events List */}
      <div className="p-2 flex flex-col gap-2 rounded-xl h-full overflow-y-scroll">
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
