import { Event } from "@/globals/types/events";
import { readableDate } from "@/globals/utils/formatting";
import { capitalize } from "@/globals/utils/text";
import { labelForGroup } from "@/globals/constants/groups";
import {
  parseExcludedGroups,
} from "@/globals/utils/buildEventStudentFilter";
import React, { memo } from "react";

/** Safely parses a JSON string array; malformed legacy data yields []. */
const safeStringArray = (json: string | null): string[] => {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

const EventMetadataCard = ({ event }: { event: Event }) => {
  const includedGroups = safeStringArray(event.includedGroups).map((value) =>
    labelForGroup(event.category, value)
  );

  const excludedGroups = parseExcludedGroups(event.excludedGroups).map(
    (entry) => `${labelForGroup(entry.type, entry.value)} (${entry.type.toLowerCase()})`
  );

  return (
    <section className="rounded-md border bg-muted/30 p-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-sm">
        <div>
          <p className="text-muted-foreground">Organizer</p>
          <p className="font-medium">{event.organizerName ?? "—"}</p>
        </div>

        {event.location && (
          <div>
            <p className="text-muted-foreground">Location</p>
            <p className="font-medium">{event.location}</p>
          </div>
        )}

        {includedGroups.length > 0 && (
          <div>
            <p className="text-muted-foreground mb-1">Participant Groups</p>
            <div className="flex flex-wrap gap-2 max-w-64 max-h-12 overflow-y-auto">
              {includedGroups.map((label, index) => (
                <p
                  key={`inc-${index}-${label}`}
                  className="text-xs font-medium bg-sky-100 rounded-2xl py-0.5 px-2"
                >
                  {label}
                </p>
              ))}
            </div>
          </div>
        )}

        {excludedGroups.length > 0 && (
          <div>
            <p className="text-muted-foreground mb-1">Excluded Groups</p>
            <div className="flex flex-wrap gap-2 max-w-64 max-h-12 overflow-y-auto">
              {excludedGroups.map((label, index) => (
                <p
                  key={`exc-${index}-${label}`}
                  className="text-xs font-medium bg-rose-100 rounded-2xl py-0.5 px-2"
                >
                  {label}
                </p>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-muted-foreground">Start Time</p>
          <p className="font-medium">{readableDate(event.start)}</p>
        </div>

        {event.end && (
          <div>
            <p className="text-muted-foreground">End Time</p>
            <p className="font-medium">{readableDate(event.end)}</p>
          </div>
        )}

        <div>
          <p className="text-muted-foreground">Event Type</p>
          <p className="font-medium">{capitalize(event.category)} Event</p>
        </div>
      </div>
    </section>
  );
};

export default memo(EventMetadataCard);
