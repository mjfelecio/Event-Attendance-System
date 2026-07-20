import { StudentRow } from "@/features/manage-list/types";
import type { StudentPagination } from "@/features/manage-list/types";
import StudentRowActions from "@/features/manage-list/components/StudentRowActions";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { StudentStatus } from "@prisma/client";

const tableHeaders = [
  "USN",
  "Last Name",
  "First Name",
  "Middle Name",
  "Program",
  "Department",
  "House",
  "Section",
  "Year Level",
  "Status",
  "Actions",
];

const STATUS_BADGE: Record<StudentStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  INACTIVE: "bg-slate-100 text-slate-600 border-slate-200",
  GRADUATED: "bg-sky-50 text-sky-700 border-sky-200",
  DROPPED: "bg-rose-50 text-rose-700 border-rose-200",
};

interface StudentTableProps {
  rows: StudentRow[];
  pagination: StudentPagination;
  activeFilterCount?: number;
  isSearching?: boolean;
  isPending?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onEditStudent?: (student: StudentRow) => void;
  onDeleteStudent?: (student: StudentRow) => void;
}

const StudentTable = ({
  rows,
  pagination,
  activeFilterCount = 0,
  isSearching = false,
  isPending = false,
  onPageChange,
  onPageSizeChange,
  onEditStudent,
  onDeleteStudent,
}: StudentTableProps) => {
  const hasRefinedView = activeFilterCount > 0 || isSearching;
  const firstRow =
    pagination.totalRows === 0
      ? 0
      : (pagination.page - 1) * pagination.pageSize + 1;
  const lastRow = Math.min(
    pagination.page * pagination.pageSize,
    pagination.totalRows
  );
  const pageNumbers = Array.from(
    new Set([
      1,
      pagination.page - 1,
      pagination.page,
      pagination.page + 1,
      pagination.totalPages,
    ])
  )
    .filter((page) => page >= 1 && page <= pagination.totalPages)
    .sort((a, b) => a - b);

  return (
    <div className="px-6 md:px-12">
      <div
        className={`overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.08)] transition-opacity ${
          isPending ? "opacity-60" : "opacity-100"
        }`}
        aria-busy={isPending}
      >
        <div className="overflow-x-auto">
          <table className="min-w-[1120px] w-full border-separate border-spacing-0 text-left text-xs text-slate-700 md:text-sm">
            <colgroup>
              <col style={{ width: "16%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "4%" }} />
            </colgroup>
            <thead className="bg-slate-50 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-slate-500 md:text-[0.68rem]">
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="border-b border-slate-200 px-4 py-3 text-center first:rounded-tl-3xl last:rounded-tr-3xl md:px-5"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={tableHeaders.length}
                    className="border-b border-slate-200 px-6 py-14 text-center text-sm text-slate-500"
                  >
                    {hasRefinedView
                      ? "No students match the current search and filters."
                      : "No students found for this selection."}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={`${row.studentNumber}-${row.section}`} className="transition hover:bg-indigo-50/35">
                    <td className="border-b border-slate-200 px-4 py-3 text-center font-mono text-[0.7rem] text-slate-500 md:px-5 md:text-xs">
                      {row.studentNumber}
                    </td>
                    <td className="border-b border-slate-200 px-4 py-3 text-center text-xs font-semibold text-slate-900 md:px-5 md:text-sm">
                      {row.lastName}
                    </td>
                    <td className="border-b border-slate-200 px-4 py-3 text-center text-xs text-slate-800 md:px-5 md:text-sm">
                      {row.firstName}
                    </td>
                    <td className="border-b border-slate-200 px-4 py-3 text-center text-xs text-slate-500 md:px-5 md:text-sm">
                      {row.middleName ?? "--"}
                    </td>
                    <td className="border-b border-slate-200 px-4 py-3 text-center md:px-5">
                      <div className="flex flex-col items-center gap-1 text-xs md:text-sm">
                        <span className="text-slate-700">{row.program ?? "--"}</span>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                          {row.schoolLevel}
                        </span>
                      </div>
                    </td>
                    <td className="border-b border-slate-200 px-4 py-3 text-center text-xs text-slate-700 md:px-5 md:text-sm">
                      {row.department ?? "--"}
                    </td>
                    <td className="border-b border-slate-200 px-4 py-3 text-center text-xs text-slate-700 md:px-5 md:text-sm">
                      {row.house ?? "--"}
                    </td>
                    <td className="border-b border-slate-200 px-4 py-3 text-center text-xs text-slate-700 md:px-5 md:text-sm">
                      {row.section}
                    </td>
                    <td className="border-b border-slate-200 px-4 py-3 text-center text-xs text-slate-700 md:px-5 md:text-sm">
                      {row.yearLevelLabel}
                    </td>
                    <td className="border-b border-slate-200 px-4 py-3 text-center md:px-5">
                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          STATUS_BADGE[row.status] ?? STATUS_BADGE.INACTIVE
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="border-b border-slate-200 px-4 py-3 text-center text-xs md:px-5 md:text-sm">
                      <StudentRowActions
                        student={row}
                        onEdit={onEditStudent}
                        onDelete={onDeleteStudent}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50 px-5 py-4 text-xs text-slate-500 lg:flex-row lg:items-center lg:justify-between md:text-sm">
          <div className="flex flex-wrap items-center gap-3">
            <p>
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {firstRow}-{lastRow}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {pagination.totalRows}
              </span>{" "}
              {hasRefinedView ? "matching " : ""}students
            </p>
            <label className="inline-flex items-center gap-2">
              Rows
              <select
                value={pagination.pageSize}
                onChange={(event) => onPageSizeChange(Number(event.target.value))}
                disabled={isPending}
                className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700"
                aria-label="Rows per page"
              >
                {[25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <nav className="flex items-center gap-1" aria-label="Student table pages">
            <button
              type="button"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || isPending}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </button>

            {pageNumbers.map((page, index) => {
              const previousPage = pageNumbers[index - 1];
              return (
                <span key={page} className="contents">
                  {previousPage && page - previousPage > 1 ? (
                    <span className="px-1 text-slate-400" aria-hidden="true">
                      ...
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => onPageChange(page)}
                    disabled={isPending}
                    aria-current={page === pagination.page ? "page" : undefined}
                    className={`inline-flex size-8 items-center justify-center rounded-lg border text-xs font-semibold transition ${
                      page === pagination.page
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-300 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700"
                    }`}
                  >
                    {page}
                  </button>
                </span>
              );
            })}

            <button
              type="button"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || isPending}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default StudentTable;
