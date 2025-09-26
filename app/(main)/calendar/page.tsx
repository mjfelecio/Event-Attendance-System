"use client";

import Calendar from "@/features/calendar/components/Calendar";
import EventDrawer from "@/features/calendar/components/EventDrawer";
import EventsContainer from "@/features/calendar/components/EventsContainer";
import { Event } from "@/globals/types/events";
import { useCallback, useRef, useState } from "react";

const CalendarPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const formData = useRef<Partial<Event>>(null);

  const handleDrawerOpen = useCallback((event: Partial<Event> | null) => {
    if (event?.id) {
      setDrawerMode("edit");
      formData.current = event;
    } else {
      setDrawerMode("create");
      formData.current = event;
    }
    setIsDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    formData.current = null;
    setIsDrawerOpen(false);
  }, []);

  const handleSelectDate = useCallback(
    (start: Date, end: Date) => {
      handleDrawerOpen({ start, end });
    },
    [handleDrawerOpen]
  );

  const handleEditEvent = useCallback(
    (event: Event) => {
      handleDrawerOpen(event);
    },
    [handleDrawerOpen]
  );

  return (
    <div className="flex flex-col md:flex-row flex-1 bg-white p-4 md:p-8 gap-4 max-h-[680px]">
      <Calendar
        isDrawerOpen={isDrawerOpen}
        onSelectDate={handleSelectDate}
        onEditEvent={handleEditEvent}
      />
      <EventsContainer onDrawerOpen={handleDrawerOpen} />
      <EventDrawer
        mode={drawerMode}
        initialData={formData.current ?? undefined}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
      />
    </div>
  );
};

export default CalendarPage;
