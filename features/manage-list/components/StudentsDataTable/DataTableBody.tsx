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
} from "@/globals/components/shared/dataTable/DataTableStates";
import DataTablePagination from "@/globals/components/shared/dataTable/DataTablePagination";
import Pagination from "./Pagination";

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
const DataTableBody = <TData,>({ table, isLoading }: Props<TData>) => {
  const hasRows = table.getRowModel().rows.length > 0;
  const hasFilters =
    table.getState().globalFilter || table.getState().columnFilters.length > 0;

  return (
    <div
      className={`flex flex-col justify-between flex-1 overflow-auto rounded-3xl border ${MIN_TABLE_HEIGHT}`}
    >
      {isLoading ? (
        <DataTableSkeleton />
      ) : (
        // ) : !hasRows ? (
        // 	hasFilters ? (
        // 		<DataTableFilteredEmptyState />
        // 	) : (
        // 		<DataTableEmptyState />
        // 	)
        // ) : (
        <Table>
          <TableHeader className="bg-slate-50 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-slate-500 md:text-[0.68rem]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-center font-black text-[11px] text-slate-500 border-b border-slate-200 p-4 first:rounded-tl-3xl last:rounded-tr-3xl md:px-5"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
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

      <Pagination table={table} />
    </div>
  );
};

export default DataTableBody;
