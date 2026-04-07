"use client";

import DataTablePagination from "@/globals/components/shared/dataTable/DataTablePagination";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import DataTableBody from "./DataTableBody";
import DataTableHeader from "./DataTableHeader";

/**
 * Props for the application's standard DataTable component.
 *
 * This table is intentionally opinionated and designed to be the
 * default solution for rendering tabular data across the app.
 * Sorting, filtering, pagination, and a toolbar are provided out of the box.
 */
type DataTableProps<TData, TValue> = {
  /** Column definitions compatible with TanStack Table */
  columns: ColumnDef<TData, TValue>[];
  /** The dataset to render */
  data: TData[];
  /** Whether the table is currently loading data */
  isLoading: boolean;
  /** Usually displays the category name */
  categoryHeader: string;
  /** Complements the category name */
  categorySubheader: string;
  /** The slug for the group currently being displayed */
  groupSlug: string;
};

/**
 * DataTable
 *
 * The standard, reusable table component used throughout the application.
 * It encapsulates common table behavior such as sorting, filtering,
 * pagination, and global search to avoid reimplementation in each feature.
 */
export function StudentsDataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  categoryHeader,
  categorySubheader,
  groupSlug
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex flex-col gap-4 w-full rounded-md">
      <DataTableHeader
        table={table}
        totalRows={0}
        categoryHeader={categoryHeader}
        categorySubheader={categorySubheader}
        groupSlug={groupSlug}
        onAddStudent={() => {}}
      />

      <DataTableBody table={table} isLoading={isLoading} />
    </div>
  );
}

export default StudentsDataTable;
