"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ReactNode, useState } from "react";
import DataTablePagination from "./DataTablePagination";
import DataTableToolbar from "./DataTableToolbar";
import DataTableViewport from "./DataTableViewPort";

/**
 * Controlled/server ("manual") table configuration.
 *
 * When provided, the DataTable stops managing pagination and sorting itself.
 * It instead reflects the supplied state and forwards every change to the
 * parent, which is expected to re-query the server. `data` is then the
 * already-paginated, already-sorted, already-filtered page for the current
 * view - the table never slices or reorders it.
 */
export type DataTableManualConfig = {
  /** Zero-based index of the current page. */
  pageIndex: number;
  /** Rows per page currently applied on the server. */
  pageSize: number;
  /** Total rows matching the active query, across every page. */
  rowCount: number;
  /** Requests a different page (zero-based). */
  onPageChange: (pageIndex: number) => void;
  /** Requests a different page size; the parent resets to page 1. */
  onPageSizeChange: (pageSize: number) => void;
  /** Current server sort expressed as TanStack sorting state. */
  sorting: SortingState;
  /** Forwards a header sort toggle to the server sort state. */
  onSortingChange: (sorting: SortingState) => void;
  /**
   * Whether a server navigation is in flight. Dims the table and disables
   * pagination so the user can't queue conflicting requests.
   */
  isPending?: boolean;
  /**
   * Whether the current query is refined (search/filter active). Drives which
   * empty state shows, since manual mode can't infer it from client filters.
   */
  isFiltered?: boolean;
};

/**
 * Props for the application's standard DataTable component.
 *
 * This table is the default solution for rendering tabular data across the app.
 * By default it manages sorting, filtering, pagination, and a search toolbar on
 * the client. Supply `manual` to drive pagination and sorting from the server
 * instead, while keeping the identical table shell, states, and pagination UI.
 */
type DataTableProps<TData, TValue> = {
  /** Column definitions compatible with TanStack Table */
  columns: ColumnDef<TData, TValue>[];

  /** The rows to render (a server page in manual mode, the full set otherwise) */
  data: TData[];

  /** Whether the table is currently loading data */
  isLoading: boolean;

  /** Title displayed in the built-in toolbar. Omit to hide the title. */
  title?: string;

  /**
   * Renders the built-in toolbar (title + optional search). Defaults to true.
   * Set false when the feature supplies its own external toolbar (Manage List),
   * so titles and search boxes are never duplicated.
   */
  showToolbar?: boolean;

  /** Shows the built-in client-side search box. Defaults to true. */
  showSearch?: boolean;

  /** Extra content rendered at the trailing edge of the built-in toolbar. */
  toolbarTrailing?: ReactNode;

  /** Custom empty state (no data, no active refinement). */
  emptyState?: ReactNode;

  /** Custom empty state shown when a search/filter yields nothing. */
  filteredEmptyState?: ReactNode;

  /**
   * Derives a stable row id from the row data (e.g. a student number) instead
   * of the array index. Recommended whenever rows can be reordered, paginated,
   * or mutated so React and TanStack track identity correctly.
   */
  getRowId?: (row: TData, index: number) => string;

  /**
   * Present => server/manual mode. Absent => the table manages pagination,
   * sorting, and filtering entirely on the client (the historical behavior).
   */
  manual?: DataTableManualConfig;
};

/**
 * DataTable
 *
 * The standard, reusable table used throughout the application. It encapsulates
 * common table behavior so features don't reimplement table markup, pagination,
 * loading, or empty states. Client-managed and server-managed modes share the
 * exact same viewport and pagination UI - only who owns the state differs.
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  title,
  showToolbar = true,
  showSearch = true,
  toolbarTrailing,
  emptyState,
  filteredEmptyState,
  getRowId,
  manual,
}: DataTableProps<TData, TValue>) {
  // Client-mode state (unused in manual mode, where the server owns it).
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const isManual = !!manual;

  const handleManualSorting: OnChangeFn<SortingState> = (updater) => {
    if (!manual) return;
    const next =
      typeof updater === "function" ? updater(manual.sorting) : updater;
    manual.onSortingChange(next);
  };

  const handleManualPagination: OnChangeFn<PaginationState> = (updater) => {
    if (!manual) return;
    const current = { pageIndex: manual.pageIndex, pageSize: manual.pageSize };
    const next = typeof updater === "function" ? updater(current) : updater;
    // A page-size change resets to the first page; the parent owns that reset.
    if (next.pageSize !== current.pageSize) {
      manual.onPageSizeChange(next.pageSize);
    } else if (next.pageIndex !== current.pageIndex) {
      manual.onPageChange(next.pageIndex);
    }
  };

  const table = useReactTable({
    data,
    columns,
    ...(getRowId ? { getRowId } : {}),
    state: manual
      ? {
          sorting: manual.sorting,
          pagination: {
            pageIndex: manual.pageIndex,
            pageSize: manual.pageSize,
          },
        }
      : {
          sorting,
          columnFilters,
          globalFilter,
        },
    // Manual mode: the server already sorted, filtered, and paginated the page.
    manualPagination: isManual,
    manualSorting: isManual,
    manualFiltering: isManual,
    ...(manual ? { rowCount: manual.rowCount } : {}),
    onSortingChange: manual ? handleManualSorting : setSorting,
    onPaginationChange: manual ? handleManualPagination : undefined,
    onColumnFiltersChange: manual ? undefined : setColumnFilters,
    onGlobalFilterChange: manual ? undefined : setGlobalFilter,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    // Client row models are skipped in manual mode so the server page renders
    // verbatim (no second, page-local sort/filter/slice on top of it).
    ...(isManual
      ? {}
      : {
          getSortedRowModel: getSortedRowModel(),
          getFilteredRowModel: getFilteredRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
        }),
  });

  const isPending = manual?.isPending ?? false;

  return (
    <div
      className={`flex flex-col max-h-screen gap-4 border border-gray-300 w-full rounded-md p-4 pb-0 shadow-sm transition-opacity ${
        isPending ? "opacity-60" : "opacity-100"
      }`}
      aria-busy={isPending}
    >
      {showToolbar && (
        <DataTableToolbar
          title={title}
          table={table}
          showSearch={showSearch && !isManual}
          trailing={toolbarTrailing}
        />
      )}
      <DataTableViewport
        table={table}
        isLoading={isLoading}
        isFiltered={manual?.isFiltered}
        emptyState={emptyState}
        filteredEmptyState={filteredEmptyState}
      />
      <DataTablePagination table={table} disabled={isPending} />
    </div>
  );
}

export default DataTable;
