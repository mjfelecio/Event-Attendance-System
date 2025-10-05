'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Eraser } from 'lucide-react';
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

  const containerRef = useRef<HTMLDivElement>(null);
  const [openSelectKey, setOpenSelectKey] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpenSelectKey(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenSelectKey(null);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const closeSelect = () => setOpenSelectKey(null);

  const renderSelect = (
    label: string,
    value: string,
    onChange: (next: string) => void,
    options: string[],
    key: string,
  ) => {
    const displayValue = value === 'all' ? `All ${label}` : value;
    const isOpen = openSelectKey === key;

    const handleSelect = (next: string) => {
      onChange(next);
      closeSelect();
    };

    const renderOption = (optionValue: string, optionLabel: string) => {
      const isActive = value === optionValue;

      return (
        <button
          key={optionValue}
          type="button"
          onClick={() => handleSelect(optionValue)}
          className={`flex w-full items-center justify-between gap-3 rounded-lg px-4 py-2 text-sm font-medium transition ${
            isActive
              ? 'bg-neutral-900 text-white shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <span className="truncate">{optionLabel}</span>
          {isActive ? <Check className="h-4 w-4" strokeWidth={1.6} /> : null}
        </button>
      );
    };

    return (
      <div className="space-y-2">
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-neutral-500">
          {label}
        </span>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenSelectKey((prev) => (prev === key ? null : key))}
            className={`flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/40 hover:border-neutral-300 ${
              isOpen ? 'ring-2 ring-neutral-400/40' : ''
            }`}
          >
            <span className="truncate text-left">{displayValue}</span>
            <ChevronDown
              className={`h-4 w-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              strokeWidth={1.6}
            />
          </button>
          {isOpen ? (
            <div className="absolute left-0 right-0 z-10 mt-2 max-h-56 overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-2 shadow-[0_16px_30px_rgba(15,23,42,0.12)]">
              {renderOption('all', `All ${label}`)}
              <div className="my-2 h-px bg-neutral-100" />
              {options.map((option) => renderOption(option, option))}
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div
      id={popoverId}
      role="dialog"
      aria-label="Filter students"
      className="absolute right-0 top-full z-20 mt-2 w-80 rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_16px_40px_RGBA(15,23,42,0.12)]"
      ref={containerRef}
    >
      <header className="mb-4">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-neutral-500">
          Filter Students By
        </p>
      </header>

      <div className="flex flex-col gap-5 text-sm text-neutral-700">
        {renderSelect('Department', filters.department, (next) => updateFilter('department', next), departments, 'department')}
        {renderSelect(
          'Program / Strand',
          filters.program,
          (next) => updateFilter('program', next),
          programs,
          'program',
        )}
        {renderSelect('House', filters.house, (next) => updateFilter('house', next), houses, 'house')}
        {renderSelect('Section', filters.section, (next) => updateFilter('section', next), sections, 'section')}
        {renderSelect('Year Level', filters.level, (next) => updateFilter('level', next), levels, 'level')}
      </div>

      <hr className="my-5 border-neutral-200" />

      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-wide text-neutral-500 transition hover:border-neutral-400 hover:text-neutral-700"
        >
          <Eraser className="h-3.5 w-3.5" strokeWidth={1.6} />
          Reset
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-wide text-white transition hover:bg-neutral-800"
        >
          <Check className="h-3.5 w-3.5" strokeWidth={1.6} />
          Done
        </button>
      </div>
    </div>
  );
};

export default StudentFilterPopover;
