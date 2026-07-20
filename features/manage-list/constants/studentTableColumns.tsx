import { ColumnDef, Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { StudentStatus } from "@prisma/client";

import { Button } from "@/globals/components/shad-cn/button";
import { StudentRow } from "@/features/manage-list/types";
import StudentRowActions from "@/features/manage-list/components/StudentRowActions";

const STATUS_BADGE: Record<StudentStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  INACTIVE: "bg-slate-100 text-slate-600 border-slate-200",
  GRADUATED: "bg-sky-50 text-sky-700 border-sky-200",
  DROPPED: "bg-rose-50 text-rose-700 border-rose-200",
};

/** Placeholder for optional fields so blank cells stay legible. */
const FALLBACK = "--";

/**
 * A sortable header that mirrors the Attendance table's sort control, so both
 * tables share one sort-header appearance. In manual mode the toggle is
 * forwarded to the server sort state; only columns the server can order carry
 * this header (see enableSorting on each column below).
 */
const SortableHeader = ({
  column,
  label,
}: {
  column: Column<StudentRow, unknown>;
  label: string;
}) => (
  <div className="text-center">
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  </div>
);

const PlainHeader = (label: string) => (
  <div className="text-center">{label}</div>
);

type StudentColumnHandlers = {
  onEditStudent?: (student: StudentRow) => void;
  onDeleteStudent?: (student: StudentRow) => void;
};

/**
 * Column definitions for the Manage List roster, rendered through the shared
 * DataTable. Sorting is enabled only on the columns the students API can order
 * by (last name, year level) and their column ids match the server sort fields
 * exactly, so a header click drives the same URL-backed sort as the Sort
 * popover. Every other column disables sorting rather than advertising an
 * order the server can't honor.
 */
export const getStudentColumns = ({
  onEditStudent,
  onDeleteStudent,
}: StudentColumnHandlers): ColumnDef<StudentRow>[] => [
  {
    accessorKey: "studentNumber",
    header: () => PlainHeader("USN"),
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-center font-mono text-xs text-slate-500">
        {row.original.studentNumber}
      </div>
    ),
  },
  {
    // id "lastName" maps to the server's `sort=lastName`.
    accessorKey: "lastName",
    header: ({ column }) => <SortableHeader column={column} label="Last Name" />,
    enableSorting: true,
    cell: ({ row }) => (
      <div className="text-center font-semibold text-slate-900">
        {row.original.lastName}
      </div>
    ),
  },
  {
    accessorKey: "firstName",
    header: () => PlainHeader("First Name"),
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-center text-slate-800">{row.original.firstName}</div>
    ),
  },
  {
    id: "middleName",
    header: () => PlainHeader("Middle Name"),
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-center text-slate-500">
        {row.original.middleName ?? FALLBACK}
      </div>
    ),
  },
  {
    id: "program",
    header: () => PlainHeader("Program"),
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex flex-col items-center gap-1">
        <span className="text-slate-700">{row.original.program ?? FALLBACK}</span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
          {row.original.schoolLevel}
        </span>
      </div>
    ),
  },
  {
    id: "department",
    header: () => PlainHeader("Department"),
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-center text-slate-700">
        {row.original.department ?? FALLBACK}
      </div>
    ),
  },
  {
    id: "house",
    header: () => PlainHeader("House"),
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-center text-slate-700">
        {row.original.house ?? FALLBACK}
      </div>
    ),
  },
  {
    accessorKey: "section",
    header: () => PlainHeader("Section"),
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-center text-slate-700">{row.original.section}</div>
    ),
  },
  {
    // id "yearLevel" maps to the server's `sort=yearLevel`.
    id: "yearLevel",
    header: ({ column }) => (
      <SortableHeader column={column} label="Year Level" />
    ),
    enableSorting: true,
    cell: ({ row }) => (
      <div className="text-center text-slate-700">
        {row.original.yearLevelLabel}
      </div>
    ),
  },
  {
    id: "status",
    header: () => PlainHeader("Status"),
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-center">
        <span
          className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            STATUS_BADGE[row.original.status] ?? STATUS_BADGE.INACTIVE
          }`}
        >
          {row.original.status}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => PlainHeader("Actions"),
    enableSorting: false,
    cell: ({ row }) => (
      <StudentRowActions
        student={row.original}
        onEdit={onEditStudent}
        onDelete={onDeleteStudent}
      />
    ),
  },
];
