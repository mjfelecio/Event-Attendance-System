"use client";

import React, { useCallback } from "react";
import { Button } from "@/globals/components/shad-cn/button";
import EventCard from "@/features/calendar/components/EventCard";
import useEvents from "@/globals/hooks/useEvents";
import { Loader2 } from "lucide-react";
import { Event } from "@/globals/types/events";
import { getUpcomingEvents } from "@/globals/utils/events";

type Props = {
  onDrawerOpen: (event: Event | null) => void;
};

const EventsContainer = ({ onDrawerOpen }: Props) => {
  const { data, isLoading, error } = useEvents();
  const events = getUpcomingEvents(data);

  const handleDrawerOpen = useCallback(
    (event: Event) => onDrawerOpen(event),
    []
  );

  return (
    <div className="relative border-2 rounded-xl p-4 overflow-hidden w-full md:basis-[30%] flex flex-col gap-4 justify-between">
      <div>
        <h1 className="text-xl md:text-2xl text-center font-bold mb-2">
          Upcoming Events
        </h1>
        {/* Upcoming Events List */}
        <div className="border-2 p-2 flex flex-col gap-2 h-[300px] md:h-[420px] border-gray-300 rounded-xl overflow-y-auto">
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
            events.map((item) => (
              <EventCard
                key={item.id}
                event={item}
                onClick={() => handleDrawerOpen(item)}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>No upcoming events</p>
            </div>
          )}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="bottom-4 flex flex-col bg-white p-2 rounded-xl items-stretch gap-2">
        <Button size="lg" onClick={() => onDrawerOpen(null)}>
          Add Event
        </Button>
        <Button
          size="lg"
          disabled={!events?.length}
          onClick={() => alert("Taking you to attendance page...")}
        >
          Take Attendance
        </Button>
      </div>
    </div>
  );
};

export default EventsContainer;
