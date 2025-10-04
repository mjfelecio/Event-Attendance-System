'use client';

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
}

const StudentSortPopover = ({
  open,
  onClose,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  resetSort,
}: StudentSortPopoverProps) => {
  if (!open) return null;

  return (
    <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
      <fieldset className="flex flex-col gap-3 text-sm text-neutral-700">
        <legend className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
          Sort by
        </legend>
        {SORT_OPTIONS.map((option) => (
          <label key={option.value} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="sort-field"
              value={option.value}
              checked={sortField === option.value}
              onChange={() => setSortField(option.value)}
              className="size-4"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
          Order
        </span>
        <div className="flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => setSortDirection('asc')}
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
              sortDirection === 'asc'
                ? 'border-neutral-700 bg-neutral-800 text-white'
                : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400'
            }`}
          >
            Asc
          </button>
          <button
            type="button"
            onClick={() => setSortDirection('desc')}
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
              sortDirection === 'desc'
                ? 'border-neutral-700 bg-neutral-800 text-white'
                : 'border-neutral-300 bg-white text-neutral-600 hover-border-neutral-400'
            }`}
          >
            Desc
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={resetSort}
          className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-500 transition hover:border-neutral-400"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-neutral-800 bg-neutral-900 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default StudentSortPopover;
