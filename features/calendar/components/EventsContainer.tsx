"use client"

import React, { useState } from "react";
import EventCard from "@/features/calendar/components/EventCard";
import { Button } from "@/globals/components/shad-cn/button";
import EventDrawer from "@/features/calendar/components/EventDrawer";

const EventsContainer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="relative border-2 rounded-xl p-4 overflow-hidden basis-[30%] flex flex-col gap-4 justify-between">
      <div>
        <h1 className="text-2xl text-center font-bold mb-2">Upcoming Events</h1>

        <div className="border-2 p-1 flex flex-col gap-1 h-[420px] border-gray-300 rounded-xl overflow-scroll">
          {Array(20)
            .fill(0)
            .map((item, index) => (
              <EventCard
                key={index}
                event={{
                  title: "Deployment",
                  date: "Sept 24, 2025",
                  time: "6:30pm",
                }}
                onClick={() => setIsDrawerOpen(true)}
              />
            ))}
        </div>
      </div>

      <div className="bottom-4 flex flex-col bg-gray-200 items-stretch gap-2">
        <Button size={"lg"} onClick={() => setIsDrawerOpen(true)}>
          Add Event
        </Button>
        <Button
          size={"lg"}
          onClick={() => alert("Taking you to attendance page...")}
        >
          Take Attendance
        </Button>
      </div>

      <EventDrawer isOpen={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </div>
  );
};

export default EventsContainer;
