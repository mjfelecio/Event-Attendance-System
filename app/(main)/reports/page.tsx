"use client";

import EventsList from "@/features/reports/components/EventsList";
import EventSummary from "@/features/reports/components/EventSummary";
import useEvents from "@/globals/hooks/useEvents";
import { useUrlSearchParams } from "@/globals/hooks/useUrlSearchParams";
import { Loader2 } from "lucide-react";
import React, { Suspense, useEffect } from "react";

const RestoringSummary = () => (
  <div className="flex flex-2 items-center justify-center rounded-md border bg-muted/40 p-8 text-muted-foreground">
    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
    Restoring report…
  </div>
);

const ReportsPageInner = () => {
  const { searchParams, setParams } = useUrlSearchParams();
  const eventId = searchParams.get("eventId");

  // The selected report is kept in the URL (/reports?eventId=…) and the Event
  // is derived fresh from the events query rather than persisted as an object,
  // so a refresh restores the same summary.
  const { data: events, isSuccess } = useEvents();
  const selectedEvent = eventId
    ? (events?.find((e) => e.id === eventId) ?? null)
    : null;

  // Deleted/invisible/invalid ids fall back to no selection, but only once the
  // query has definitively loaded without the id - never during loading or a
  // transient failure. Unrelated params are preserved.
  const definitelyInvalid =
    !!eventId && isSuccess && !events?.some((e) => e.id === eventId);

  useEffect(() => {
    if (definitelyInvalid) {
      setParams({ eventId: null });
    }
  }, [definitelyInvalid, setParams]);

  const handleSelectEventId = (id: string) => {
    setParams({ eventId: id });
  };

  const isRestoring = !!eventId && !selectedEvent && !definitelyInvalid;

  return (
    <div className="flex flex-col flex-1 p-4">
      <h1 className="text-3xl font-medium mb-4">Reports Page</h1>
      <div className="flex flex-1 gap-4">
        <EventsList
          selectedEventId={selectedEvent?.id ?? null}
          onSelectEventId={handleSelectEventId}
        />
        {isRestoring ? (
          <RestoringSummary />
        ) : (
          <EventSummary selectedEvent={selectedEvent} />
        )}
      </div>
    </div>
  );
};

const ReportsPage = () => (
  <Suspense fallback={null}>
    <ReportsPageInner />
  </Suspense>
);

export default ReportsPage;
