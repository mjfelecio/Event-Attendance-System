import { StudentRow } from "@/features/manage-list/types";
import StudentRowActions from "@/features/manage-list/components/StudentRowActions";

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
  "Actions",
];

interface StudentTableProps {
  rows: StudentRow[];
  totalRows?: number;
  activeFilterCount?: number;
  isSearching?: boolean;
  onEditStudent?: (student: StudentRow) => void;
  onDeleteStudent?: (student: StudentRow) => void;
}

const StudentTable = ({
  rows,
  totalRows,
  activeFilterCount = 0,
  isSearching = false,
  onEditStudent,
  onDeleteStudent,
}: StudentTableProps) => {
  const visibleRowsCount = rows.length;
  const total = totalRows ?? visibleRowsCount;
  const hasRefinedView = activeFilterCount > 0 || isSearching;

  return (
    <div className="px-6 md:px-12">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
        <div className="overflow-x-auto">
          <table className="min-w-[1120px] w-full border-separate border-spacing-0 text-left text-xs text-slate-700 md:text-sm">
            <colgroup>
              <col style={{ width: "18%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "6%" }} />
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

        <div className="flex flex-col gap-1 border-t border-slate-200 bg-slate-50 px-5 py-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between md:text-sm">
          <p>
            Showing <span className="font-semibold text-slate-700">{visibleRowsCount}</span> of{" "}
            <span className="font-semibold text-slate-700">{total}</span> students
          </p>
          <p>
            {hasRefinedView
              ? "Tip: clear some filters or search terms to widen results."
              : "Tip: use Sort and Filter to quickly narrow large lists."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentTable;
