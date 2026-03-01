import Link from "next/link";
import SelectionBoardFrame from "@/features/manage-list/components/SelectionBoardFrame";
import { SHS_STRANDS } from "@/features/manage-list/constants/categories";

const ShsSelectionBoard = () => {
  return (
    <div className="flex w-full flex-col gap-6 text-center">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          SHS Selection
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          Which Strand?
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Choose a strand to view and manage students.
        </p>
      </header>

      <SelectionBoardFrame>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Academics
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {SHS_STRANDS.academics.map((strand) => (
                <Link
                  key={strand.slug}
                  href={{
                    pathname: "/manage-list/manage-student",
                    query: {
                      category: "shs",
                      item: strand.slug,
                      label: strand.title,
                    },
                  }}
                  className="group rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/60 hover:text-indigo-700 hover:shadow-[0_10px_20px_rgba(37,99,235,0.16)]"
                >
                  {strand.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Technical Vocational Livelihood
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {SHS_STRANDS.tvl.map((strand) => (
                <Link
                  key={strand.slug}
                  href={{
                    pathname: "/manage-list/manage-student",
                    query: {
                      category: "shs",
                      item: strand.slug,
                      label: strand.title,
                    },
                  }}
                  className="group rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/60 hover:text-indigo-700 hover:shadow-[0_10px_20px_rgba(37,99,235,0.16)]"
                >
                  {strand.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </SelectionBoardFrame>
    </div>
  );
};

export default ShsSelectionBoard;
