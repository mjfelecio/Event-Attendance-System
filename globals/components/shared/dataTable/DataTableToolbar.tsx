import React from "react";
import { DataTableSearch } from "./DataTableSearch";
import { Table as TableType } from "@tanstack/react-table";

type Props<TData> = {
  table: TableType<TData>;
  title: string;
};

const DataTableToolbar = <TData,>({ table, title }: Props<TData>) => {
  return (
    <div className="flex flex-row justify-between">
      <h3 className="text-3xl font-semibold">{title}</h3>
      <div className="flex flex-row gap-2">
        <DataTableSearch table={table} />
        {/* <SortButton /> */}
        {/* <FilterButton /> */}
      </div>
    </div>
  );
};

export default DataTableToolbar;
