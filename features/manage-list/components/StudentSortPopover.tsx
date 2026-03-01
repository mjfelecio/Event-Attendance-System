'use client';

import { ArrowDown, ArrowUp, RotateCcw } from 'lucide-react';
import {
  SORT_OPTIONS,
  type SortDirection,
  type SortField,
} from '@/features/manage-list/hooks/useStudentTableControls';

interface StudentSortPopoverProps {
  open: boolean;
  onClose: () => void;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortDirection: SortDirection;
  setSortDirection: (direction: SortDirection) => void;
  resetSort: () => void;
  popoverId?: string;
}

const StudentSortPopover = ({
  open,
  onClose,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  resetSort,
  popoverId,
}: StudentSortPopoverProps) => {
  if (!open) {
    return null;
  }

  return (
    <div
      id={popoverId}
      role="dialog"
      aria-label="Sort students"
      className="absolute right-0 top-full z-20 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.14)]"
    >
      {/* Sort By Section */}
      <fieldset className="flex flex-col gap-3 text-sm text-slate-700">
        <legend className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Sort By
        </legend>

        <div className="flex flex-col gap-2">
          {SORT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-slate-50"
            >
              <input
                type="radio"
                name="sort-field"
                value={option.value}
                checked={sortField === option.value}
                onChange={() => setSortField(option.value)}
                className="size-4 accent-indigo-600"
              />
              <span className="text-sm text-slate-700">{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Divider */}
      <hr className="my-4 border-slate-200" />

      {/* Order Section */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Order
        </span>

        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setSortDirection('asc')}
            className={`flex items-center justify-center gap-1.5 rounded-lg border px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-wide transition ${
              sortDirection === 'asc'
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
            }`}
            aria-pressed={sortDirection === 'asc'}
          >
            <ArrowUp className="h-3 w-3" strokeWidth={1.6} />
            Asc
          </button>

          <button
            type="button"
            onClick={() => setSortDirection('desc')}
            className={`flex items-center justify-center gap-1.5 rounded-lg border px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-wide transition ${
              sortDirection === 'desc'
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
            }`}
            aria-pressed={sortDirection === 'desc'}
          >
            <ArrowDown className="h-3 w-3" strokeWidth={1.6} />
            Desc
          </button>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-4 border-slate-200" />

      {/* Footer Buttons */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={resetSort}
          className="flex items-center gap-1.5 rounded-full border border-slate-300 px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-wide text-slate-500 transition hover:border-slate-400 hover:text-slate-700"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.6} />
          Reset
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-full border border-indigo-600 bg-indigo-600 px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-wide text-white transition hover:bg-indigo-500"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default StudentSortPopover;
