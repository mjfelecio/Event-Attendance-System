import { Event } from "@/globals/types/events";
import { readableDate } from "@/globals/utils/formatting";
import { capitalize } from "lodash";
import React from "react";

const EventMetadataCard = ({ event }: { event: Event }) => {
  return (
    <section className="rounded-md border bg-muted/30 p-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-sm">
        {event.userId && (
          <div>
            <p className="text-muted-foreground">Organizer</p>
            <p className="font-medium">{event.userId}</p>
          </div>
        )}

        {event.location && (
          <div>
            <p className="text-muted-foreground">Location</p>
            <p className="font-medium">{event.location}</p>
          </div>
        )}

        {event.category !== "ALL" && (
          <div>
            <p className="text-muted-foreground mb-1">Participant Groups</p>
            <div className="flex flex-wrap gap-2 max-w-64 max-h-12 overflow-y-scroll">
              {(event.includedGroups
                ? JSON.parse(event?.includedGroups)
                : []
              ).map((group: string) => (
                <>
                  <p className="text-xs font-medium bg-sky-100 rounded-2xl py-0.5 px-2">
                    {group}
                  </p>
                </>
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

export default EventMetadataCard;
