"use client";

import Link from "next/link";
import SelectionBoardFrame from "@/features/students/components/SelectionBoardFrame";
import GroupTileArt from "@/features/students/components/GroupTileArt";
import { DEPARTMENT_ABBREVIATION_BY_SLUG } from "@/features/students/constants/categories";
import { useFetchGroupsByCategory } from "@/globals/hooks/useGroups";
import { Skeleton } from "@/globals/components/shad-cn/skeleton";

const CollegeSelectionBoard = () => {
  // Departments come from the Group table, so one added in Settings gets a tile
  // here without a code change.
  const { data: departments, isLoading, isError } = useFetchGroupsByCategory(
    "DEPARTMENT",
  );

  return (
    <div className="flex w-full flex-col gap-6 text-center">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          College Selection
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          Which Department?
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Select a department to open its roster.
        </p>
      </header>

      <SelectionBoardFrame>
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 place-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="min-h-[280px] w-full max-w-[320px] rounded-2xl"
                />
              ))
            : departments?.map((dept) => (
                <Link
                  key={dept.slug}
                  href={{
                    pathname: "/students/student-list",
                    query: {
                      category: "COLLEGE",
                      department: dept.slug,
                    },
                  }}
                  className="group relative flex min-h-[280px] w-full max-w-[320px] flex-col items-center justify-center gap-6 overflow-hidden rounded-2xl border border-slate-200 bg-white px-8 py-7 shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_18px_34px_rgba(37,99,235,0.16)]"
                >
                  {/* Decorative Gradient */}
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_58%)] opacity-60 transition group-hover:opacity-100" />

                  <div className="flex items-center justify-center">
                    <GroupTileArt slug={dept.slug} name={dept.name} />
                  </div>

                  <div className="relative space-y-2 text-center">
                    <p className="text-xl font-semibold text-slate-900">
                      {dept.name}
                    </p>
                    <p className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {DEPARTMENT_ABBREVIATION_BY_SLUG[dept.slug] ?? "Dept."}
                    </p>
                  </div>
                </Link>
              ))}
        </div>

        {isError ? (
          <p className="mt-4 text-sm text-rose-600">
            Couldn&apos;t load departments. Please retry.
          </p>
        ) : null}

        {!isLoading && !isError && departments?.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            No departments yet. Add one in Settings.
          </p>
        ) : null}
      </SelectionBoardFrame>
    </div>
  );
};

export default CollegeSelectionBoard;
