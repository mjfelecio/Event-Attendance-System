'use client';

import { ArrowDown, ArrowUp, RotateCcw, Check, X } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/globals/components/shad-cn/popover";
import { PopoverClose } from '@radix-ui/react-popover';

const SORT_OPTIONS = [
  { label: 'Student ID', value: 'id' },
  { label: 'Last Name', value: 'lastName' },
  { label: 'First Name', value: 'firstName' },
  { label: 'Year Level', value: 'yearLevel' },
];

interface Props<TData> {
  table: Table<TData>;
  children: React.ReactNode;
}

const StudentSortPopover = <TData,>({ table, children }: Props<TData>) => {
  const sorting = table.getState().sorting;
  const currentSort = sorting[0] ?? { id: 'lastName', desc: false };

  const updateSortField = (id: string) => {
    table.setSorting([{ id, desc: currentSort.desc }]);
  };

  const updateSortDirection = (desc: boolean) => {
    table.setSorting([{ id: currentSort.id, desc }]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.15)] backdrop-blur-sm"
      >
        <div className="flex flex-col gap-5">
          {/* Header with Reset */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Sort Settings
            </span>
            <button
              onClick={() => table.resetSorting()}
              className="group flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 transition hover:bg-indigo-50"
              title="Reset to default"
            >
              <RotateCcw className="h-3 w-3 transition-transform group-hover:-rotate-45" />
              Reset
            </button>
          </div>

          {/* Sort By Section */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              {SORT_OPTIONS.map((option) => {
                const isSelected = currentSort.id === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => updateSortField(option.value)}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="text-sm font-semibold">{option.label}</span>
                    {isSelected && <Check className="h-4 w-4" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Order Toggle */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-1 rounded-2xl border border-slate-100 bg-slate-50/50 p-1">
              {[
                { label: 'Ascending', value: false, icon: ArrowUp },
                { label: 'Descending', value: true, icon: ArrowDown },
              ].map((dir) => (
                <button
                  key={dir.label}
                  onClick={() => updateSortDirection(dir.value)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
                    currentSort.desc === dir.value
                      ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <dir.icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                  {dir.label}
                </button>
              ))}
            </div>
          </div>

          <PopoverClose asChild>
            <button className="flex w-full items-center justify-center rounded-full border border-slate-200 bg-white py-2 text-[11px] font-black uppercase tracking-widest text-slate-500 transition-all hover:bg-slate-50 active:scale-[0.98]">
              Close
            </button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default StudentSortPopover;