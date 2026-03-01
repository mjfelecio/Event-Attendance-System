import Image from "next/image";
import Link from "next/link";
import SelectionBoardFrame from "@/features/manage-list/components/SelectionBoardFrame";
import { COLLEGE_DEPARTMENTS } from "@/features/manage-list/constants/categories";

const CollegeSelectionBoard = () => {
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
        <div className="grid gap-5 md:grid-cols-3">
          {COLLEGE_DEPARTMENTS.map((dept) => (
            <Link
              key={dept.title}
              href={{
                pathname: "/manage-list/manage-student",
                query: {
                  category: "college",
                  item: dept.slug,
                  label: dept.title,
                },
              }}
              className="group relative flex min-h-[280px] flex-col items-center justify-center gap-6 overflow-hidden rounded-2xl border border-slate-200 bg-white px-8 py-7 shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_18px_34px_rgba(37,99,235,0.16)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_58%)] opacity-60 transition group-hover:opacity-100" />
              <div className="flex items-center justify-center">
                <div className="relative h-40 w-40">
                  <Image
                    src={dept.logo}
                    alt={`${dept.abbreviation} logo`}
                    fill
                    sizes="10rem"
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="relative space-y-2 text-center">
                <p className="text-xl font-semibold text-slate-900">
                  {dept.title}
                </p>
                <p className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {dept.abbreviation}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </SelectionBoardFrame>
    </div>
  );
};

export default CollegeSelectionBoard;
