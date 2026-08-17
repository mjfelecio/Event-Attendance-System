import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";

import StatusBadge from "@/globals/components/shared/StatusBadge";
import type { OverviewEvent } from "@/globals/types/reports";
import { capitalizeLabel } from "@/globals/utils/text";
import { percent } from "@/features/reports/components/charts/chartTheme";

/**
 * Columns for the reports hub's event list.
 *
 * Column definitions live in a `constants/` file beside the feature rather than
 * inline in the rendering component — the shared `DataTable`'s documented
 * convention.
 */

/** Turnout as a tone: strong, adequate, or poor. */
const rateTone = (rate: number | null) => {
  if (rate === null) return "neutral" as const;
  if (rate >= 75) return "success" as const;
  if (rate >= 50) return "warning" as const;
  return "danger" as const;
};

export const overviewColumns: ColumnDef<OverviewEvent>[] = [
  {
    id: "start",
    accessorFn: (row) => new Date(row.start).getTime(),
    header: "Date",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-sm text-slate-600">
        {format(new Date(row.original.start), "MMM d, yyyy")}
      </span>
    ),
    enableGlobalFilter: false,
  },
  {
    accessorKey: "title",
    header: "Event",
    cell: ({ row }) => (
      <Link
        href={`/reports/events/${row.original.id}`}
        className="font-medium text-slate-900 underline-offset-4 hover:text-indigo-600 hover:underline"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "category",
    header: "Scope",
    cell: ({ getValue }) => (
      <span className="text-sm text-slate-600">
        {capitalizeLabel(getValue() as string)}
      </span>
    ),
    enableGlobalFilter: false,
  },
  {
    id: "attended",
    accessorFn: (row) => row.present,
    header: "Attended",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-sm text-slate-600">
        {row.original.present} / {row.original.eligible}
      </span>
    ),
    enableGlobalFilter: false,
  },
  {
    id: "rate",
    // Null rates sort to the bottom rather than reading as 0% turnout.
    accessorFn: (row) => row.rate ?? -1,
    header: "Turnout",
    cell: ({ row }) => (
      <StatusBadge tone={rateTone(row.original.rate)}>
        {percent(row.original.rate)}
      </StatusBadge>
    ),
    enableGlobalFilter: false,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Link
        href={`/reports/events/${row.original.id}`}
        className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
      >
        View
      </Link>
    ),
    enableGlobalFilter: false,
  },
];
