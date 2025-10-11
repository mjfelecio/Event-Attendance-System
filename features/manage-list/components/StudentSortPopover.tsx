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
      className="absolute right-0 top-full z-20 mt-2 w-60 rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.12)]"
    >
      {/* Sort By Section */}
      <fieldset className="flex flex-col gap-3 text-sm text-neutral-700">
        <legend className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
          Sort By
        </legend>

        <div className="flex flex-col gap-2">
          {SORT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-neutral-50 transition"
            >
              <input
                type="radio"
                name="sort-field"
                value={option.value}
                checked={sortField === option.value}
                onChange={() => setSortField(option.value)}
                className="size-4 accent-neutral-800"
              />
              <span className="text-sm text-neutral-700">{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Divider */}
      <hr className="my-4 border-neutral-200" />

      {/* Order Section */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
          Order
        </span>

        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setSortDirection('asc')}
            className={`flex items-center justify-center gap-1.5 rounded-lg border px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-wide transition ${
              sortDirection === 'asc'
                ? 'border-neutral-800 bg-neutral-800 text-white'
                : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400'
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
                ? 'border-neutral-800 bg-neutral-800 text-white'
                : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400'
            }`}
            aria-pressed={sortDirection === 'desc'}
          >
            <ArrowDown className="h-3 w-3" strokeWidth={1.6} />
            Desc
          </button>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-4 border-neutral-200" />

      {/* Footer Buttons */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={resetSort}
          className="flex items-center gap-1.5 rounded-full border border-neutral-300 px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-wide text-neutral-500 transition hover:border-neutral-400 hover:text-neutral-700"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.6} />
          Reset
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-wide text-white transition hover:bg-neutral-800"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default StudentSortPopover;
