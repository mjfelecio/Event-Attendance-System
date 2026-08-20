import React, { ReactNode } from "react";
import { DataTableSearch } from "./DataTableSearch";
import { Table as TableType } from "@tanstack/react-table";

type Props<TData> = {
  table: TableType<TData>;
  /** Title shown at the leading edge. Omit to render no title. */
  title?: string;
  /** Whether to render the built-in client-side search box. */
  showSearch?: boolean;
  /** Extra controls rendered after the search box. */
  trailing?: ReactNode;
};

/**
 * DataTableToolbar
 *
 * The built-in toolbar for client-managed tables: an optional title plus an
 * optional search box and trailing slot. Features that need richer controls
 * (Student List) render their own external toolbar instead and disable this one
 * via the DataTable `showToolbar` prop, so titles/search are never duplicated.
 */
const DataTableToolbar = <TData,>({
  table,
  title,
  showSearch = true,
  trailing,
}: Props<TData>) => {
  return (
    <div className="flex flex-row flex-wrap items-center justify-between gap-2">
      {title ? (
        <h3 className="text-3xl font-semibold">{title}</h3>
      ) : (
        <span />
      )}
      <div className="flex flex-row flex-wrap items-center gap-2">
        {showSearch && <DataTableSearch table={table} />}
        {trailing}
      </div>
    </div>
  );
};

export default DataTableToolbar;
