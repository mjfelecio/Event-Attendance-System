"use client";

import { Eraser, Filter } from "lucide-react";
import { Table } from "@tanstack/react-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/globals/components/shad-cn/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/globals/components/shad-cn/select";
import { PopoverClose } from "@radix-ui/react-popover";
import { Option } from "@/globals/types/primitives";
import { capitalize } from "lodash";

interface Props<TData> {
  table: Table<TData>;
  children: React.ReactNode;
  options: Record<string, Option[]>;
}

const FilterGroup = ({
  label,
  columnId,
  items,
  filterValue,
  onFilterValueChange,
}: {
  label: string;
  columnId: string;
  items: Option[];
  filterValue: string;
  onFilterValueChange: (colId: string, val: string) => void;
}) => {
  // Hide the filter group if they only have a single item
  // Since it wont do anything anyways since that is already
  // what is being displayed
  if (!items || items.length === 1) return null;

  const formattedLabel = label.includes("Level")
    ? capitalize(label.split("L")[0]) + " " + "Level"
    : capitalize(label);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
        {formattedLabel}
      </span>
      <Select
        value={filterValue}
        onValueChange={(val) => onFilterValueChange(columnId, val)}
      >
        <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
          <SelectValue placeholder={`All ${formattedLabel}`} />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-slate-200 shadow-xl">
          <SelectItem value="all" className="text-xs font-medium">
            All {formattedLabel}
          </SelectItem>
          <div className="my-1 h-px bg-slate-100" />
          {items.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className="text-xs font-medium"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const StudentFilterPopover = <TData,>({
  table,
  children,
  options,
}: Props<TData>) => {
  const columnFilters = table.getState().columnFilters;

  const getFilterValue = (id: string) =>
    (columnFilters.find((f) => f.id === id)?.value as string) || "all";

  const setFilterValue = (id: string, value: string) => {
    const column = table.getColumn(id);
    if (column) {
      column.setFilterValue(value === "all" ? undefined : value);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-72 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.15)] backdrop-blur-sm"
      >
        <div className="flex flex-col gap-6">
          {/* Header logic remains same */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-600">
              <Filter className="h-3.5 w-3.5" strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Filters
              </span>
            </div>
            <button
              onClick={() => table.resetColumnFilters()}
              className="group flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            >
              <Eraser className="h-3 w-3" /> Clear
            </button>
          </div>

          {/* DYNAMIC SCROLL AREA */}
          <div className="flex flex-col gap-5 max-h-[350px] overflow-y-auto pr-1">
            {Object.entries(options).map(([category, items]) => {
              // Ensures flat data like schoolLevel and yearLevel are accessed properly
              const normalizedCategory = category.includes("Level")
                ? category.split("L")[0].toLowerCase() + "Level"
                : category.toLowerCase();

              return (
                <FilterGroup
                  key={category}
                  label={normalizedCategory}
                  columnId={normalizedCategory}
                  items={items}
                  filterValue={getFilterValue(normalizedCategory)}
                  onFilterValueChange={setFilterValue}
                />
              );
            })}
          </div>

          <hr className="border-slate-100" />
          <PopoverClose asChild>
            <button className="flex w-full items-center justify-center rounded-full bg-indigo-600 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-md shadow-indigo-100 transition-all hover:bg-indigo-500 active:scale-95">
              Done
            </button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default StudentFilterPopover;
