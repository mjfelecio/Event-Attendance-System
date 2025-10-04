'use client';

import { useMemo, useState } from "react";
import StudentTable from "@/features/manage-list/components/StudentTable";
import { ManageStudentContext, StudentRow } from "@/features/manage-list/types";

interface ManageStudentClientProps {
  category: ManageStudentContext["category"];
  label?: string;
  item?: string;
  categoryHeading: string;
  rows: StudentRow[];
}

const ManageStudentClient = ({
  category,
  label,
  item,
  categoryHeading,
  rows,
}: ManageStudentClientProps) => {
  const [searchValue, setSearchValue] = useState("");

  const filteredRows = useMemo(() => {
    const lowerSearch = searchValue.trim().toLowerCase();

    return rows.filter((student) => {
      const matchesCategory = (() => {
        if (category === "all") return true;
        if (category === "college") {
          if (item) return student.departmentSlug === item;
          return student.schoolLevel === "COLLEGE";
        }
        if (category === "shs") {
          if (item) return student.programSlug === item;
          return student.schoolLevel === "SHS";
        }
        if (category === "house") {
          if (item) return student.houseSlug === item;
          return Boolean(student.house);
        }
        return true;
      })();

      if (!matchesCategory) return false;

      if (!lowerSearch) return true;

      const haystack = [
        student.studentNumber,
        student.lastName,
        student.firstName,
        student.middleName,
        student.program,
        student.department,
        student.house,
        student.section,
        student.yearLevelLabel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(lowerSearch);
    });
  }, [category, item, rows, searchValue]);

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="px-6 md:px-12">
        <header className="text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
            {categoryHeading}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-800 md:text-4xl">
            {label ?? "Manage Students"}
          </h1>
          {item && (
            <p className="mt-2 text-xs uppercase tracking-[0.4em] text-neutral-400">
              {item}
            </p>
          )}
        </header>
      </div>

      <div className="px-6 md:px-12">
        <label className="flex flex-col gap-2 text-left text-sm font-medium text-neutral-600 md:flex-row md:items-center md:justify-between">
          <span className="uppercase tracking-[0.25em] text-neutral-500">
            Quick search
          </span>
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search students by name, program, section..."
            className="mt-1 w-full rounded-full border border-neutral-300 bg-white px-5 py-2 text-sm font-normal text-neutral-700 shadow-sm transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40 md:mt-0 md:w-80"
          />
        </label>
      </div>

      <div className="px-0 md:px-4">
        <StudentTable rows={filteredRows} />
      </div>
    </div>
  );
};

export default ManageStudentClient;
