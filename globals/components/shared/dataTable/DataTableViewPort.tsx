"use client";

import { ReactNode } from "react";
import { flexRender, Table as TableType } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/globals/components/shad-cn/table";
import {
  DataTableEmptyState,
  DataTableFilteredEmptyState,
  DataTableSkeleton,
} from "./DataTableStates";

type Props<TData> = {
  /** TanStack table instance controlling row and column state */
  table: TableType<TData>;
  /** Whether the data is still loading */
  isLoading: boolean;
  /**
   * Overrides how the empty state is chosen. Client mode infers "refined" from
   * TanStack's own filter state; manual/server mode must pass it explicitly
   * because search and filters live in the URL, not the table instance.
   */
  isFiltered?: boolean;
  /** Custom empty state (no data, no active refinement). */
  emptyState?: ReactNode;
  /** Custom empty state shown when a search/filter yields nothing. */
  filteredEmptyState?: ReactNode;
};

const MIN_TABLE_HEIGHT = "min-h-[420px]";

/**
 * DataTableViewport
 *
 * Renders the actual table markup (headers, rows, and cells) plus the loading
 * and empty states. Kept separate so DataTable stays focused on orchestration.
 * This is the single table shell shared by every feature, client or server.
 */
const DataTableViewport = <TData,>({
  table,
  isLoading,
  isFiltered,
  emptyState,
  filteredEmptyState,
}: Props<TData>) => {
  const hasRows = table.getRowModel().rows.length > 0;
  const hasFilters =
    isFiltered ??
    Boolean(
      table.getState().globalFilter ||
        table.getState().columnFilters.length > 0
    );

  return (
    <div
      className={`flex-1 overflow-auto rounded-md border ${MIN_TABLE_HEIGHT}`}
    >
      {isLoading ? (
        <DataTableSkeleton />
      ) : !hasRows ? (
        hasFilters ? (
          filteredEmptyState ?? <DataTableFilteredEmptyState />
        ) : (
          emptyState ?? <DataTableEmptyState />
        )
      ) : (
        <Table>
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default DataTableViewport;
