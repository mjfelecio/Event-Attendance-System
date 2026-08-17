import { memo } from "react";

import StatusBadge from "@/globals/components/shared/StatusBadge";
import { surface } from "@/globals/constants/designTokens";
import type { ReportEvent } from "@/globals/types/reports";
import { readableDate } from "@/globals/utils/formatting";
import { capitalizeLabel } from "@/globals/utils/text";

type Field = { label: string; value: string };

/**
 * The event's own details, beside its attendance numbers.
 *
 * Previously rendered `event.createdById` — a raw cuid — under the label
 * "Organizer". The creator's name is now carried on `ReportEvent.createdBy`,
 * selected down to id + name so the response never ships a password hash.
 */
const EventMetadataCard = ({ event }: { event: ReportEvent }) => {
  const fields: Field[] = [
    ...(event.createdBy ? [{ label: "Organizer", value: event.createdBy.name }] : []),
    ...(event.location ? [{ label: "Location", value: event.location }] : []),
    { label: "Starts", value: readableDate(event.start) },
    { label: "Ends", value: readableDate(event.end) },
    { label: "Scope", value: `${capitalizeLabel(event.category)} event` },
  ];

  return (
    <section className={`${surface.card} p-5`}>
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="text-slate-500">{field.label}</p>
            <p className="mt-0.5 font-medium text-slate-900">{field.value}</p>
          </div>
        ))}

        {/* ALL / COLLEGE / SHS ignore includedGroups entirely. */}
        {event.category !== "ALL" && event.includedGroups.length > 0 ? (
          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-slate-500">Participant groups</p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {event.includedGroups.map((group) => (
                <StatusBadge key={group.id} tone="primary">
                  {group.name}
                </StatusBadge>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default memo(EventMetadataCard);
