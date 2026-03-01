"use client";

import { Dispatch, SetStateAction } from "react";
import { ArrowUpDown, Filter, Plus, Upload } from "lucide-react";
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
  totalRows: number;
  visibleRowsCount: number;
  activeFilterCount: number;
  isSearching: boolean;
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
  onAddStudent: () => void;
  onImportStudents: () => void;
}

const StudentManageToolbar = ({
  categoryHeading,
  label,
  item,
  totalRows,
  visibleRowsCount,
  activeFilterCount,
  isSearching,
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
  onAddStudent,
  onImportStudents,
}: StudentManageToolbarProps) => {
  return (
    <div className="px-6 md:px-12">
      <div className="relative rounded-3xl border border-slate-200 bg-white/95 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.14),transparent_58%)]" />
        <div className="relative flex flex-col gap-5 p-5 md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">
                {categoryHeading}
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                {label ?? "Students List"}
              </h1>
              {item && (
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                  {item}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                Total: {totalRows}
              </span>
              <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                Visible: {visibleRowsCount}
              </span>
              {activeFilterCount > 0 ? (
                <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  Filters: {activeFilterCount}
                </span>
              ) : null}
              {isSearching ? (
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Search Active
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onAddStudent}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-600 bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-sm transition hover:bg-indigo-500"
              >
                <Plus className="size-4" strokeWidth={1.6} />
                Add
              </button>

              <button
                type="button"
                onClick={onImportStudents}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 shadow-sm transition hover:border-slate-400 hover:text-slate-800"
              >
                <Upload className="size-4" strokeWidth={1.6} />
                Import
              </button>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSortOpen((prev) => !prev);
                      setIsFilterOpen(false);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 shadow-sm transition hover:border-slate-400 hover:text-slate-800"
                    aria-expanded={isSortOpen}
                    aria-controls="student-sort-popover"
                  >
                    <ArrowUpDown className="size-4" strokeWidth={1.6} />
                    Sort
                  </button>

                  <StudentSortPopover
                    open={isSortOpen}
                    onClose={() => setIsSortOpen(false)}
                    sortField={sortField}
                    setSortField={setSortField}
                    sortDirection={sortDirection}
                    setSortDirection={setSortDirection}
                    resetSort={resetSort}
                    popoverId="student-sort-popover"
                  />
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFilterOpen((prev) => !prev);
                      setIsSortOpen(false);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 shadow-sm transition hover:border-slate-400 hover:text-slate-800"
                    aria-expanded={isFilterOpen}
                    aria-controls="student-filter-popover"
                  >
                    <Filter className="size-4" strokeWidth={1.6} />
                    Filter
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
                    popoverId="student-filter-popover"
                  />
                </div>
              </div>
            </div>

            <StudentSearchInput value={searchValue} onChange={(value) => setSearchValue(value)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentManageToolbar;
