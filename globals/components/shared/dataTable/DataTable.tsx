"use client";

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
import DataTablePagination from "./DataTablePagination";
import DataTableToolbar from "./DataTableToolbar";
import DataTableViewport from "./DataTableViewPort";

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

  /** Title displayed in the table toolbar */
  title: string;

  /** Whether the table is currently loading data */
  isLoading: boolean;
};

/**
 * DataTable
 *
 * The standard, reusable table component used throughout the application.
 * It encapsulates common table behavior such as sorting, filtering,
 * pagination, and global search to avoid reimplementation in each feature.
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  isLoading,
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
    <div className="flex flex-col max-h-screen gap-4 border border-gray-300 w-full rounded-md p-4 pb-0 shadow-sm">
      <DataTableToolbar title={title} table={table} />
      <DataTableViewport table={table} isLoading={isLoading} />
      <DataTablePagination table={table} />
    </div>
  );
}

export default DataTable;
