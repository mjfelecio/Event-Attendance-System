"use client";

import Calendar from "@/features/calendar/components/Calendar";
import EventDrawer from "@/features/calendar/components/EventDrawer";
import EventsContainer from "@/features/calendar/components/EventsContainer";
import { Event } from "@/globals/types/events";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

/**
 * CalendarPage Component
 *
 * Main container for the calendar feature, orchestrating state management
 * and communication between child components (Calendar, EventsContainer, EventDrawer).
 *
 * Responsibilities:
 * - Manage drawer open/close state and mode (create/edit)
 * - Handle form data for new and existing events
 * - Coordinate event selection from calendar or list
 */
const CalendarPage = () => {
  const searchParams = useSearchParams();
  const hasOpenedCreate = useRef(false);
  // Drawer visibility state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Drawer mode: "create" for new events, "edit" for existing events
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");

  // Event data for the drawer form
  // null in create mode, populated with event data in edit mode
  const [formData, setFormData] = useState<Partial<Event> | null>(null);

  /**
   * Opens the drawer and sets up the appropriate mode
   *
   * @param event - Event data (null for create mode, Event object for edit mode)
   */
  const handleDrawerOpen = useCallback((event: Partial<Event> | null) => {
    setFormData(event);
    setDrawerMode(event?.id ? "edit" : "create");
    setIsDrawerOpen(true);
  }, []);

  /**
   * Closes the drawer and clears form data
   */
  const handleDrawerClose = useCallback(() => {
    setFormData(null);
    setIsDrawerOpen(false);
  }, []);

  /**
   * Handles date selection from calendar
   * Opens drawer in create mode with start and end times
   *
   * @param start - Selected start date/time
   * @param end - Selected end date/time
   */
  const handleSelectDate = useCallback(
    (start: Date, end: Date) => {
      handleDrawerOpen({ start, end });
    },
    [handleDrawerOpen]
  );

  /**
   * Handles event selection from calendar or events list
   * Opens drawer in edit mode with existing event data
   *
   * @param event - Event to edit
   */
  const handleEditEvent = useCallback(
    (event: Event) => {
      handleDrawerOpen(event);
    },
    [handleDrawerOpen]
  );

  useEffect(() => {
    const shouldCreate = searchParams.get("create") === "1";
    if (shouldCreate && !hasOpenedCreate.current) {
      handleDrawerOpen(null);
      hasOpenedCreate.current = true;
    }
  }, [searchParams, handleDrawerOpen]);

  return (
    <div className="flex flex-col flex-1 bg-white p-4 md:p-8 gap-6">
      {/* Calendar Component - displays events and allows date selection */}
      <Calendar
        isDrawerOpen={isDrawerOpen}
        onSelectDate={handleSelectDate}
        onEditEvent={handleEditEvent}
      />

      {/* Events Container - displays list of upcoming/all events */}
      <EventsContainer onDrawerOpen={handleDrawerOpen} />

      {/* Event Drawer - form for creating/editing events */}
      <EventDrawer
        mode={drawerMode}
        initialData={formData ?? undefined}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
      />
    </div>
  );
};

export default CalendarPage;
