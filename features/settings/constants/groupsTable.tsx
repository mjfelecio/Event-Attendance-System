import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/globals/components/shad-cn/button";
import StatusBadge from "@/globals/components/shared/StatusBadge";
import type { ManagedGroup } from "@/globals/hooks/useGroups";

type Actions = {
  onEdit: (group: ManagedGroup) => void;
  onDelete: (group: ManagedGroup) => void;
};

/**
 * Columns for the operator console's group table.
 *
 * Row actions are injected rather than imported so the column defs stay free of
 * component state, matching how the student table builds its columns.
 */
export const getGroupColumns = ({
  onEdit,
  onDelete,
}: Actions): ColumnDef<ManagedGroup>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium text-slate-900">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
        {row.original.slug}
      </code>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <StatusBadge>{row.original.category}</StatusBadge>,
  },
  {
    accessorKey: "studentCount",
    header: "Students",
    cell: ({ row }) => (
      <span className="tabular-nums text-slate-600">
        {row.original.studentCount}
      </span>
    ),
  },
  {
    accessorKey: "eventCount",
    header: "Events",
    cell: ({ row }) => (
      <span className="tabular-nums text-slate-600">
        {row.original.eventCount}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label={`Rename ${row.original.name}`}
          onClick={() => onEdit(row.original)}
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label={`Delete ${row.original.name}`}
          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          onClick={() => onDelete(row.original)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    ),
  },
];
