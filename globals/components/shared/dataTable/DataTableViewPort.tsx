"use client";

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
};

const MIN_TABLE_HEIGHT = "min-h-[420px]";

/**
 * DataTableViewport
 *
 * Renders the actual table markup (headers, rows, and cells).
 * Separated to keep the main DataTable component focused on orchestration
 * rather than rendering details.
 */
const DataTableViewport = <TData,>({ table, isLoading }: Props<TData>) => {
  const hasRows = table.getRowModel().rows.length > 0;
  const hasFilters =
    table.getState().globalFilter || table.getState().columnFilters.length > 0;

  return (
    <div
      className={`flex-1 overflow-auto rounded-md border ${MIN_TABLE_HEIGHT}`}
    >
      {isLoading ? (
        <DataTableSkeleton />
      ) : !hasRows ? (
        hasFilters ? (
          <DataTableFilteredEmptyState />
        ) : (
          <DataTableEmptyState />
        )
      ) : (
        <Table>
          <TableHeader>
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
