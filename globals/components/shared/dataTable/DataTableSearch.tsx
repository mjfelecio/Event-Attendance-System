import { Table } from "@tanstack/react-table";
import SearchBar from "../SearchBar";

interface Props<TData> {
  table: Table<TData>;
}

export function DataTableSearch<TData>({ table }: Props<TData>) {
  return (
    <SearchBar
      query={(table.getState().globalFilter as string) ?? ""}
      onQueryChange={(q) => table.setGlobalFilter(q)}
			placeholder="Search..."
    />
  );
}
