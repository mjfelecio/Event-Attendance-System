import { StudentRow } from "@/features/manage-list/types";

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
}

const StudentTable = ({ rows }: StudentTableProps) => {
  const total = rows.length;

  return (
    <div className="w-full rounded-[2.25rem] border border-neutral-300 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.1)]">
      <table className="w-full border-separate border-spacing-0 text-left text-xs text-neutral-700 md:text-sm">
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
        <thead className="bg-neutral-50 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-neutral-500 md:text-[0.65rem]">
          <tr>
            {tableHeaders.map((header) => (
              <th
                key={header}
                scope="col"
                className="border-b border-neutral-300 px-4 py-3 text-center first:rounded-tl-[2.25rem] last:rounded-tr-[2.25rem] md:px-6 md:py-4"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-neutral-700">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={tableHeaders.length}
                className="border-b border-neutral-200 px-6 py-16 text-center text-sm text-neutral-400"
              >
                No students found for this selection.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={`${row.studentNumber}-${row.section}`}
                className="transition hover:bg-neutral-50"
              >
                <td className="border-b border-neutral-200 px-4 py-3 text-center font-mono text-[0.68rem] text-neutral-500 break-all md:px-6 md:py-4 md:text-xs">
                  {row.studentNumber}
                </td>
                <td className="border-b border-neutral-200 px-4 py-3 text-center text-xs font-semibold text-neutral-900 md:px-6 md:py-4 md:text-sm">
                  {row.lastName}
                </td>
                <td className="border-b border-neutral-200 px-4 py-3 text-center text-xs text-neutral-800 md:px-6 md:py-4 md:text-sm">
                  {row.firstName}
                </td>
                <td className="border-b border-neutral-200 px-4 py-3 text-center text-xs text-neutral-500 md:px-6 md:py-4 md:text-sm">
                  {row.middleName ?? "—"}
                </td>
                <td className="border-b border-neutral-200 px-4 py-3 text-center text-xs text-neutral-700 md:px-6 md:py-4 md:text-sm">
                  {row.program ?? "—"}
                </td>
                <td className="border-b border-neutral-200 px-4 py-3 text-center text-xs text-neutral-700 md:px-6 md:py-4 md:text-sm">
                  {row.department ?? "—"}
                </td>
                <td className="border-b border-neutral-200 px-4 py-3 text-center text-xs text-neutral-700 md:px-6 md:py-4 md:text-sm">
                  {row.house ?? "—"}
                </td>
                <td className="border-b border-neutral-200 px-4 py-3 text-center text-xs text-neutral-700 md:px-6 md:py-4 md:text-sm">
                  {row.section}
                </td>
                <td className="border-b border-neutral-200 px-4 py-3 text-center text-xs text-neutral-700 md:px-6 md:py-4 md:text-sm">
                  {row.yearLevelLabel}
                </td>
                <td className="border-b border-neutral-200 px-4 py-3 text-center text-xs md:px-6 md:py-4 md:text-sm">
                  <div className="flex items-center justify-center gap-2 md:gap-3">
                    <button
                      type="button"
                      className="rounded-full border border-emerald-500 bg-white px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-emerald-600 transition hover:bg-emerald-50 md:px-4 md:text-xs"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-rose-500 bg-white px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-rose-600 transition hover:bg-rose-50 md:px-4 md:text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex flex-col gap-3 border-t border-neutral-200 bg-neutral-50 px-4 py-4 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex flex-wrap items-center gap-2 text-neutral-600">
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-600 transition hover:border-neutral-400"
            aria-label="Previous page"
          >
            ◀
          </button>
          {Array.from({ length: 10 }).map((_, index) => {
            const page = index + 1;
            const isActive = page === 1;
            return (
              <button
                key={page}
                type="button"
                className={`flex size-8 items-center justify-center rounded-full border text-sm transition ${
                  isActive
                    ? "border-neutral-600 bg-neutral-700 text-white"
                    : "border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400"
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-600 transition hover:border-neutral-400"
            aria-label="Next page"
          >
            ▶
          </button>
        </div>

        <p className="text-right text-xs text-neutral-500 md:text-sm">
          Showing 1–{Math.min(20, total)} of {total} students
        </p>
      </div>
    </div>
  );
};

export default StudentTable;
