"use client";

import { Dispatch, SetStateAction } from "react";
import {
  type FilterState,
  type SortDirection,
  type SortField,
} from "@/features/manage-list/hooks/useStudentTableControls";
import StudentFilterPopover from "@/features/manage-list/components/StudentFilterPopover";
import StudentSearchInput from "@/features/manage-list/components/StudentSearchInput";
import StudentSortPopover from "@/features/manage-list/components/StudentSortPopover";

interface StudentManageToolbarProps {
  categoryHeading: string;
  label?: string;
  item?: string;
  searchValue: string;
  setSearchValue: (value: string) => void;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortDirection: SortDirection;
  setSortDirection: (direction: SortDirection) => void;
  resetSort: () => void;
  filters: FilterState;
  updateFilter: (key: keyof FilterState, value: string) => void;
  clearFilters: () => void;
  departments: string[];
  programs: string[];
  sections: string[];
  levels: string[];
  houses: string[];
  isSortOpen: boolean;
  setIsSortOpen: Dispatch<SetStateAction<boolean>>;
  isFilterOpen: boolean;
  setIsFilterOpen: Dispatch<SetStateAction<boolean>>;
}

const StudentManageToolbar = ({
  categoryHeading,
  label,
  item,
  searchValue,
  setSearchValue,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  resetSort,
  filters,
  updateFilter,
  clearFilters,
  departments,
  programs,
  sections,
  levels,
  houses,
  isSortOpen,
  setIsSortOpen,
  isFilterOpen,
  setIsFilterOpen,
}: StudentManageToolbarProps) => {
  return (
    <div className="px-6 md:px-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-500">
            {categoryHeading}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-800 md:text-4xl">
            {label ?? "Students List"}
          </h1>
          {item && (
            <p className="mt-2 text-xs uppercase tracking-[0.4em] text-neutral-400">
              {item}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 md:justify-end">
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsSortOpen((prev) => !prev);
                  setIsFilterOpen(false);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600 shadow-sm transition hover:border-neutral-400 hover:text-neutral-800"
              >
                ⇅ Sort
              </button>

              <StudentSortPopover
                open={isSortOpen}
                onClose={() => setIsSortOpen(false)}
                sortField={sortField}
                setSortField={setSortField}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
                resetSort={resetSort}
              />
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsFilterOpen((prev) => !prev);
                  setIsSortOpen(false);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600 shadow-sm transition hover:border-neutral-400 hover:text-neutral-800"
              >
                ⊚ Filter
              </button>

              <StudentFilterPopover
                open={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                updateFilter={updateFilter}
                clearFilters={clearFilters}
                departments={departments}
                programs={programs}
                sections={sections}
                levels={levels}
                houses={houses}
              />
            </div>
          </div>

          <StudentSearchInput value={searchValue} onChange={(value) => setSearchValue(value)} />
        </div>
      </div>
    </div>
  );
};

export default StudentManageToolbar;
