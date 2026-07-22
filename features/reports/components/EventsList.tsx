"use client";

import { Loader2, Search, CalendarX2, SearchX } from "lucide-react";
import React, { useId, useMemo, useState } from "react";

import useEvents from "@/globals/hooks/useEvents";
import { Event } from "@/globals/types/events";
import { Input } from "@/globals/components/shad-cn/input";
import { cn } from "@/globals/libs/shad-cn";
import ReportEventCard from "./ReportEventCard";

type Props = {
  selectedEvent: Event | null;
  onSelectEvent: (event: Event) => void;
};

type ReportFilter = "all" | "upcoming" | "completed";

// "upcoming" keeps its inclusive meaning: every event that isn't completed,
// including one currently in progress. The label says "Active & upcoming" so
// that an ongoing event is clearly still found here; the internal value stays
// "upcoming" to avoid churn.
const FILTERS: { value: ReportFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Active & upcoming" },
  { value: "completed", label: "Completed" },
];

const isCompleted = (event: Event, now: number) =>
  new Date(event.end ?? event.start).getTime() < now;

const EventsList = ({ selectedEvent, onSelectEvent }: Props) => {
  const { data: events, isLoading, error } = useEvents();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ReportFilter>("all");
  const searchId = useId();

  // Upcoming sorted soonest-first; completed sorted newest-first. For "all",
  // upcoming events lead (chronological) and completed follow (most recent
  // first). Search matches title, location, and category. Filtering here is
  // purely a user-chosen view over the events the API already authorized - no
  // event visible to the user is dropped for any other reason.
  const visibleEvents = useMemo(() => {
    if (!events) return [];
    const now = Date.now();
    const q = query.trim().toLowerCase();

    const matches = (event: Event) => {
      if (!q) return true;
      return [event.title, event.location ?? "", event.category]
        .join(" ")
        .toLowerCase()
        .includes(q);
    };

    const upcoming = events
      .filter((e) => !isCompleted(e, now) && matches(e))
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
      );
    const completed = events
      .filter((e) => isCompleted(e, now) && matches(e))
      .sort(
        (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
      );

    if (filter === "upcoming") return upcoming;
    if (filter === "completed") return completed;
    return [...upcoming, ...completed];
  }, [events, query, filter]);

  const totalEvents = events?.length ?? 0;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_32px_rgba(15,23,42,0.06)] lg:h-[calc(100vh-11rem)]">
      {/* Header + controls */}
      <div className="shrink-0 border-b border-slate-100 p-4">
        <h2 className="text-lg font-semibold text-slate-900">Events</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Search and pick an event to view its report.
        </p>

        <div className="relative mt-3">
          <label htmlFor={searchId} className="sr-only">
            Search events
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, location, category"
            className="pl-9"
          />
        </div>

        <div
          role="group"
          aria-label="Filter events"
          className="mt-3 flex items-center gap-1 rounded-lg bg-slate-100 p-1"
        >
          {FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "flex-1 rounded-md px-2 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                  active
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 text-slate-500">
            <Loader2 className="size-6 animate-spin" />
            <span className="text-sm">Loading events…</span>
          </div>
        ) : error ? (
          <div className="flex h-full min-h-40 flex-col items-center justify-center gap-1 text-center text-rose-600">
            <p className="text-sm font-medium">Failed to load events.</p>
            <span className="text-xs text-rose-500">
              Please refresh the page and try again.
            </span>
          </div>
        ) : totalEvents === 0 ? (
          <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 text-center text-slate-500">
            <CalendarX2 className="size-8 text-slate-300" />
            <p className="text-sm font-medium">No events yet</p>
            <span className="text-xs text-slate-400">
              Events you can report on will appear here.
            </span>
          </div>
        ) : visibleEvents.length === 0 ? (
          <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 text-center text-slate-500">
            <SearchX className="size-8 text-slate-300" />
            <p className="text-sm font-medium">No matching events</p>
            <span className="text-xs text-slate-400">
              Try a different search or filter.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {visibleEvents.map((event) => (
              <ReportEventCard
                key={event.id}
                event={event}
                isSelected={selectedEvent?.id === event.id}
                onSelect={onSelectEvent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsList;
