import Link from "next/link";
import { BookOpenText, Cpu, Sparkles } from "lucide-react";
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
          Choose a strand to view and manage students quickly.
        </p>
      </header>

      <SelectionBoardFrame>
        <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-2">
          <article className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-[linear-gradient(180deg,#ffffff_0%,#eef2ff_100%)] p-5 text-center shadow-[0_14px_30px_rgba(79,70,229,0.12)]">
            <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-indigo-300/20 blur-2xl" />
            <div className="relative mb-4 flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">
                <BookOpenText className="size-3.5" />
                Academics
              </div>
              <p className="text-xs text-slate-500">
                Core strands for general and university preparation.
              </p>
            </div>
            <div className="grid place-items-center gap-4 sm:grid-cols-2">
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
                  className="group inline-flex w-full max-w-[220px] items-center justify-center gap-2 rounded-xl border border-indigo-100 bg-white px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.16em] text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-[0_10px_20px_rgba(37,99,235,0.16)]"
                >
                  <Sparkles className="size-3.5 text-indigo-400 transition group-hover:text-indigo-600" />
                  {strand.title}
                </Link>
              ))}
            </div>
          </article>

          <article className="relative overflow-hidden rounded-3xl border border-cyan-100 bg-[linear-gradient(180deg,#ffffff_0%,#ecfeff_100%)] p-5 text-center shadow-[0_14px_30px_rgba(8,145,178,0.12)]">
            <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-cyan-300/20 blur-2xl" />
            <div className="relative mb-4 flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
                <Cpu className="size-3.5" />
                TVL
              </div>
              <p className="text-xs text-slate-500">
                Skills-focused strands for applied technical paths.
              </p>
            </div>
            <div className="grid place-items-center gap-4 sm:grid-cols-2">
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
                  className="group inline-flex w-full max-w-[220px] items-center justify-center gap-2 rounded-xl border border-cyan-100 bg-white px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.16em] text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 hover:shadow-[0_10px_20px_rgba(8,145,178,0.16)]"
                >
                  <Sparkles className="size-3.5 text-cyan-400 transition group-hover:text-cyan-600" />
                  {strand.title}
                </Link>
              ))}
            </div>
          </article>
        </div>
      </SelectionBoardFrame>
    </div>
  );
};

export default ShsSelectionBoard;
