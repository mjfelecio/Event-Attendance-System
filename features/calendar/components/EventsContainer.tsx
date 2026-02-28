"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Button } from "@/globals/components/shad-cn/button";
import EventCard from "@/features/calendar/components/EventCard";
import useEvents, {
  useApproveEvent,
  useRejectEvent,
} from "@/globals/hooks/useEvents";
import { Loader2 } from "lucide-react";
import { Event } from "@/globals/types/events";
import Link from "next/link";
import { useAuth } from "@/globals/contexts/AuthContext";
import { toastDanger, toastSuccess, toastWarning } from "@/globals/components/shared/toasts";

type Props = {
  onDrawerOpen: (event: Event | null) => void;
};

type EventFilter = "current" | "upcoming" | "finished" | "all";

const EventsContainer = ({ onDrawerOpen }: Props) => {
  const { data, isLoading, error } = useEvents();
  const [filter, setFilter] = useState<EventFilter>("upcoming");
  const { user } = useAuth();
  const approveEvent = useApproveEvent();
  const rejectEvent = useRejectEvent();

  const { filteredEvents, counts, pendingEvents } = useMemo(() => {
    const events = data ?? [];
    const now = new Date();

    const classify = (event: Event) => {
      const start = new Date(event.start);
      const end = new Date(event.end ?? event.start);

      const isFinished = end < now;
      const isCurrent = start <= now && end >= now;
      const isUpcoming = start > now;

      return { isFinished, isCurrent, isUpcoming };
    };

    const baseSorted = [...events].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    const finishedSorted = [...events]
      .filter((event) => classify(event).isFinished)
      .sort(
        (a, b) =>
          new Date(b.end ?? b.start).getTime() -
          new Date(a.end ?? a.start).getTime()
      );

    const counts = {
      current: events.filter((event) => classify(event).isCurrent).length,
      upcoming: events.filter((event) => classify(event).isUpcoming).length,
      finished: events.filter((event) => classify(event).isFinished).length,
      all: events.length,
    };

    const filteredEvents =
      filter === "current"
        ? baseSorted.filter((event) => classify(event).isCurrent)
        : filter === "upcoming"
        ? baseSorted.filter((event) => classify(event).isUpcoming)
        : filter === "finished"
        ? finishedSorted
        : baseSorted;

    const pendingEvents = events.filter((event) => event.status === "PENDING");

    return { filteredEvents, counts, pendingEvents };
  }, [data, filter]);

  const handleDrawerOpen = useCallback(
    (event: Event) => onDrawerOpen(event),
    []
  );

  const handleApprove = (eventId: string) => {
    approveEvent.mutate(
      { id: eventId },
      {
        onSuccess: () => {
          toastSuccess("Event approved", "The event is now live.");
        },
        onError: (error) => {
          toastDanger(
            "Approval failed",
            error instanceof Error ? error.message : undefined
          );
        },
      }
    );
  };

  const handleReject = (event: Event) => {
    const input = window.prompt(
      `Provide a reason for rejecting "${event.title}":`,
      event.rejectionReason ?? "Needs revisions"
    );

    const reason = input?.trim();
    if (!reason) {
      toastWarning("Rejection reason required");
      return;
    }

    rejectEvent.mutate(
      { id: event.id, reason },
      {
        onSuccess: () => {
          toastSuccess("Event rejected", reason);
        },
        onError: (error) => {
          toastDanger(
            "Rejection failed",
            error instanceof Error ? error.message : undefined
          );
        },
      }
    );
  };

  const isAdmin = user?.role === "ADMIN";
  const isProcessing = approveEvent.isPending || rejectEvent.isPending;

  return (
    <section className="rounded-2xl border-2 p-6 w-full flex flex-col gap-6 bg-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Events</h1>
          <p className="text-sm text-slate-500">
            Filter by status to find what you need fast.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Button size="lg" onClick={() => onDrawerOpen(null)}>
            Create event
          </Button>
          {data?.length ? (
            <Button asChild size="lg" variant="outline">
              <Link href="/attendance">Take attendance</Link>
            </Button>
          ) : (
            <Button size="lg" variant="outline" disabled>
              Take attendance
            </Button>
          )}
        </div>
      </div>

      {isAdmin ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Pending event reviews
              </h2>
              <p className="text-xs text-slate-500">
                Approve or reject submitted events.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-600">
              {pendingEvents.length} pending
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {pendingEvents.length === 0 ? (
              <p className="text-xs text-slate-500">No pending events.</p>
            ) : (
              pendingEvents.slice(0, 6).map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {event.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(event.start).toLocaleString()} • {event.category}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-500"
                      onClick={() => handleApprove(event.id)}
                      disabled={isProcessing}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(event)}
                      disabled={isProcessing}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
            {pendingEvents.length > 6 ? (
              <p className="text-xs text-slate-500">
                + {pendingEvents.length - 6} more pending events.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: "current", label: "Current", count: counts.current },
            { id: "upcoming", label: "Upcoming", count: counts.upcoming },
            { id: "finished", label: "Finished", count: counts.finished },
            { id: "all", label: "All", count: counts.all },
          ] as const
        ).map((option) => {
          const isActive = filter === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {option.label} · {option.count}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
            <span className="ml-2 text-lg">Loading events...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-red-600">
            <p className="font-medium">Failed to load events.</p>
            <span className="text-sm">Try refreshing the page</span>
          </div>
        ) : filteredEvents.length ? (
          filteredEvents.map((item) => (
            <EventCard
              key={item.id}
              event={item}
              onClick={() => handleDrawerOpen(item)}
            />
          ))
        ) : (
          <div className="flex items-center justify-center py-10 text-gray-500">
            <p>No events found for this filter.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsContainer;
