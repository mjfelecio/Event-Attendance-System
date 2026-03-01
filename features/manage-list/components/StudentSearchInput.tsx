'use client';

import { Search, X } from 'lucide-react';

interface StudentSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const StudentSearchInput = ({ value, onChange }: StudentSearchInputProps) => {
  return (
    <div className="flex w-full min-w-[240px] flex-1 items-center justify-end xl:w-auto">
      <label className="relative flex w-full items-center xl:w-80">
        <Search className="pointer-events-none absolute left-4 size-4 text-slate-400" strokeWidth={1.6} />
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search students..."
          aria-label="Search students"
          className="w-full rounded-full border border-slate-300 bg-white px-10 py-2 text-sm font-normal text-slate-700 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300/40"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 inline-flex size-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Clear search"
          >
            <X className="size-4" strokeWidth={1.8} />
          </button>
        ) : null}
      </label>
    </div>
  );
};

export default StudentSearchInput;
