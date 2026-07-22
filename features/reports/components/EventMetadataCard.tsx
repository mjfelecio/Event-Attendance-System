"use client";

import React, { memo, useState } from "react";

import { Event } from "@/globals/types/events";
import { readableDate } from "@/globals/utils/formatting";
import { capitalizeLabel } from "@/globals/utils/text";

type FieldProps = { label: string; children: React.ReactNode };

const Field = ({ label, children }: FieldProps) => (
  <div className="min-w-0">
    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <div className="mt-0.5 text-sm font-medium text-slate-800">{children}</div>
  </div>
);

// Show a bounded number of group chips inline; the rest collapse behind a
// "+N more" toggle instead of the old tiny native scrollbar (max-h-12
// overflow-y-scroll), which was awkward and easy to miss.
const MAX_VISIBLE_GROUPS = 8;

const ParticipantGroups = ({ event }: { event: Event }) => {
  const [expanded, setExpanded] = useState(false);
  const groups = event.includedGroups;
  const visible = expanded ? groups : groups.slice(0, MAX_VISIBLE_GROUPS);
  const hidden = groups.length - visible.length;

  return (
    <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
      {visible.map((group) => (
        <span
          key={group.id}
          className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700"
        >
          {group.name}
        </span>
      ))}
      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          +{hidden} more
        </button>
      )}
      {expanded && groups.length > MAX_VISIBLE_GROUPS && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="rounded-full px-2 py-0.5 text-xs font-semibold text-indigo-600 transition hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Show less
        </button>
      )}
    </div>
  );
};

const EventMetadataCard = ({ event }: { event: Event }) => {
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Organizer">
          {/* Always a human-readable name; never the raw createdById. */}
          {event.organizerName ?? "Unknown organizer"}
        </Field>

        <Field label="Location">{event.location || "—"}</Field>

        <Field label="Event Type">{capitalizeLabel(event.category)} Event</Field>

        <Field label="Start Time">{readableDate(event.start)}</Field>

        {event.end && <Field label="End Time">{readableDate(event.end)}</Field>}

        {event.category !== "ALL" && event.includedGroups.length > 0 && (
          <div className="min-w-0 sm:col-span-2 lg:col-span-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Participant Groups
            </p>
            {/* Key by event id so the expanded/collapsed state resets when a
                different event is selected (otherwise it would persist across
                switches). Each newly selected event starts collapsed. */}
            <ParticipantGroups key={event.id} event={event} />
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(EventMetadataCard);
