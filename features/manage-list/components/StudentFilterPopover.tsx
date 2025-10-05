'use client';

import { Check, Eraser } from 'lucide-react';
import { type FilterState } from '@/features/manage-list/hooks/useStudentTableControls';

interface StudentFilterPopoverProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  updateFilter: (key: keyof FilterState, value: string) => void;
  clearFilters: () => void;
  departments: string[];
  programs: string[];
  sections: string[];
  levels: string[];
  houses: string[];
  popoverId?: string;
}

const StudentFilterPopover = ({
  open,
  onClose,
  filters,
  updateFilter,
  clearFilters,
  departments,
  programs,
  sections,
  levels,
  houses,
  popoverId,
}: StudentFilterPopoverProps) => {
  if (!open) return null;

  const renderSelect = (
    label: string,
    value: string,
    onChange: (next: string) => void,
    options: string[],
  ) => (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-700 focus:border-neutral-500 focus:outline-none"
      >
        <option value="all">All {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div
      id={popoverId}
      role="dialog"
      aria-label="Filter students"
      className="absolute right-0 top-full z-20 mt-2 w-72 rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.12)]"
    >
      <div className="flex flex-col gap-4 text-sm text-neutral-700">
        {renderSelect('Department', filters.department, (next) => updateFilter('department', next), departments)}
        {renderSelect('Program / Strand', filters.program, (next) => updateFilter('program', next), programs)}
        {renderSelect('House', filters.house, (next) => updateFilter('house', next), houses)}
        {renderSelect('Section', filters.section, (next) => updateFilter('section', next), sections)}
        {renderSelect('Year Level', filters.level, (next) => updateFilter('level', next), levels)}
      </div>

      <div className="mt-5 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex items-center gap-1 rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-500 transition hover:border-neutral-400"
        >
          <Eraser className="size-3.5" strokeWidth={1.6} />
          Reset
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white"
        >
          <Check className="size-3.5" strokeWidth={1.6} />
          Done
        </button>
      </div>
    </div>
  );
};

export default StudentFilterPopover;
