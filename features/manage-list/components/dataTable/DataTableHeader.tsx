import { Table as TableType } from "@tanstack/react-table";
import { ArrowUpDown, Filter, Plus, Upload } from "lucide-react";
import Link from "next/link";
import StudentSearchInput from "@/features/manage-list/components/StudentSearchInput";
import { useState } from "react";

type Props<TData> = {
  // DATA
  table: TableType<TData>;
  totalRows: number;

  // UI
  categoryHeader: string;
  categorySubheader: string;
  groupSlug: string; // sub category perhaps

  // CALLBACKS
  onAddStudent: () => void;
};

const DataTableHeader = <TData,>({
  table,
  totalRows,
  categoryHeader,
  categorySubheader,
  groupSlug,
  onAddStudent,
}: Props<TData>) => {
  const [activePopover, setActivePopover] = useState<"filter" | "sort" | null>(
    null,
  );
  const [searchValue, setSearchValue] = useState("");

  const visibleRowsCount = table.getRowCount();

  return (
    <div className="p-6 gap-5 overflow-hidden flex flex-col relative rounded-3xl border border-slate-200 bg-white/95 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur">
      {/* Gradient Thingy */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.14),transparent_58%)]" />

      {/* The Actual Content */}
      <div className="relative flex flex-col gap-5">
        {/* Top Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          {/* Left Header Part */}
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">
              {categorySubheader}
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              {categoryHeader}
            </h1>
            {groupSlug && (
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                {groupSlug}
              </p>
            )}
          </div>

          {/* Right Header Badges */}
          {/* TODO: Extract these into badge components */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
              Total: {totalRows}
            </span>
            <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              Visible: {visibleRowsCount}
            </span>
            {/* {activeFilterCount > 0 ? (
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Filters: {activeFilterCount}
              </span>
            ) : null} */}
            {/* {isSearching ? (
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Search Active
              </span>
            ) : null} */}
          </div>
        </div>
        {/* End Top Header */}

        {/* Start Bottom Header */}
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

            <Link
              href={"/manage-list/import"}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 shadow-sm transition hover:border-slate-400 hover:text-slate-800"
            >
              <Upload className="size-4" strokeWidth={1.6} />
              Import
            </Link>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActivePopover("sort")}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 shadow-sm transition hover:border-slate-400 hover:text-slate-800"
                  aria-expanded={activePopover === "sort"}
                  aria-controls="student-sort-popover"
                >
                  <ArrowUpDown className="size-4" strokeWidth={1.6} />
                  Sort
                </button>

                {/* <StudentSortPopover
                    open={isSortOpen}
                    onClose={() => setIsSortOpen(false)}
                    sortField={sortField}
                    setSortField={setSortField}
                    sortDirection={sortDirection}
                    setSortDirection={setSortDirection}
                    resetSort={resetSort}
                    popoverId="student-sort-popover"
                  /> */}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActivePopover("filter")}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 shadow-sm transition hover:border-slate-400 hover:text-slate-800"
                  aria-expanded={activePopover === "filter"}
                  aria-controls="student-filter-popover"
                >
                  <Filter className="size-4" strokeWidth={1.6} />
                  Filter
                </button>

                {/* <StudentFilterPopover
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
                  /> */}
              </div>
            </div>
          </div>

          <StudentSearchInput
            value={searchValue}
            onChange={(value) => setSearchValue(value)}
          />
        </div>
      </div>
    </div>
  );
};

export default DataTableHeader;
