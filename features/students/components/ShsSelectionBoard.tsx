"use client";

import Link from "next/link";
import { BookOpenText, Cpu, LayoutGrid, Sparkles } from "lucide-react";

import SelectionBoardFrame from "@/features/students/components/SelectionBoardFrame";
import { STRAND_TRACK_BY_SLUG } from "@/features/students/constants/categories";
import { GroupChoice, useFetchGroupsByCategory } from "@/globals/hooks/useGroups";
import { Skeleton } from "@/globals/components/shad-cn/skeleton";

type PanelTone = "indigo" | "cyan" | "slate";

// Static class lookups - never build these at runtime, or Tailwind ships the
// page unstyled.
const PANEL_CLASS: Record<PanelTone, string> = {
  indigo:
    "relative overflow-hidden rounded-3xl border border-indigo-100 bg-[linear-gradient(180deg,#ffffff_0%,#eef2ff_100%)] p-5 text-center shadow-[0_14px_30px_rgba(79,70,229,0.12)]",
  cyan: "relative overflow-hidden rounded-3xl border border-cyan-100 bg-[linear-gradient(180deg,#ffffff_0%,#ecfeff_100%)] p-5 text-center shadow-[0_14px_30px_rgba(8,145,178,0.12)]",
  slate:
    "relative overflow-hidden rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 text-center shadow-[0_14px_30px_rgba(15,23,42,0.08)]",
};

const GLOW_CLASS: Record<PanelTone, string> = {
  indigo:
    "pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-indigo-300/20 blur-2xl",
  cyan: "pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-cyan-300/20 blur-2xl",
  slate:
    "pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-slate-300/20 blur-2xl",
};

const CHIP_CLASS: Record<PanelTone, string> = {
  indigo:
    "inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700",
  cyan: "inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700",
  slate:
    "inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600",
};

const LINK_CLASS: Record<PanelTone, string> = {
  indigo:
    "group inline-flex w-full max-w-[220px] items-center justify-center gap-2 rounded-xl border border-indigo-100 bg-white px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.16em] text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-[0_10px_20px_rgba(37,99,235,0.16)]",
  cyan: "group inline-flex w-full max-w-[220px] items-center justify-center gap-2 rounded-xl border border-cyan-100 bg-white px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.16em] text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 hover:shadow-[0_10px_20px_rgba(8,145,178,0.16)]",
  slate:
    "group inline-flex w-full max-w-[220px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.16em] text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:shadow-[0_10px_20px_rgba(15,23,42,0.12)]",
};

const ICON_CLASS: Record<PanelTone, string> = {
  indigo: "size-3.5 text-indigo-400 transition group-hover:text-indigo-600",
  cyan: "size-3.5 text-cyan-400 transition group-hover:text-cyan-600",
  slate: "size-3.5 text-slate-400 transition group-hover:text-slate-600",
};

const StrandPanel = ({
  tone,
  title,
  description,
  icon: Icon,
  strands,
}: {
  tone: PanelTone;
  title: string;
  description: string;
  icon: typeof BookOpenText;
  strands: GroupChoice[];
}) => (
  <article className={PANEL_CLASS[tone]}>
    <div className={GLOW_CLASS[tone]} />
    <div className="relative mb-4 flex flex-col items-center gap-2">
      <div className={CHIP_CLASS[tone]}>
        <Icon className="size-3.5" />
        {title}
      </div>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
    <div className="grid place-items-center gap-4 sm:grid-cols-2">
      {strands.map((strand) => (
        <Link
          key={strand.slug}
          href={{
            pathname: "/students/student-list",
            query: { category: "SHS", strand: strand.slug },
          }}
          className={LINK_CLASS[tone]}
        >
          <Sparkles className={ICON_CLASS[tone]} />
          {strand.name}
        </Link>
      ))}
    </div>
  </article>
);

const ShsSelectionBoard = () => {
  const { data: strands, isLoading, isError } =
    useFetchGroupsByCategory("STRAND");

  const all = strands ?? [];
  const academics = all.filter(
    (s) => STRAND_TRACK_BY_SLUG[s.slug] === "ACADEMIC",
  );
  const tvl = all.filter((s) => STRAND_TRACK_BY_SLUG[s.slug] === "TECHVOC");
  // A strand added in Settings has no track - the Group table has no column for
  // one - so it lands here rather than disappearing.
  const other = all.filter((s) => !STRAND_TRACK_BY_SLUG[s.slug]);

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
        {isLoading ? (
          <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-2">
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-64 w-full rounded-3xl" />
          </div>
        ) : (
          <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-2">
            <StrandPanel
              tone="indigo"
              title="Academics"
              description="Core strands for general and university preparation."
              icon={BookOpenText}
              strands={academics}
            />
            <StrandPanel
              tone="cyan"
              title="TVL"
              description="Skills-focused strands for applied technical paths."
              icon={Cpu}
              strands={tvl}
            />
            {other.length > 0 ? (
              <div className="lg:col-span-2">
                <StrandPanel
                  tone="slate"
                  title="Other"
                  description="Strands added in Settings, which have no assigned track."
                  icon={LayoutGrid}
                  strands={other}
                />
              </div>
            ) : null}
          </div>
        )}

        {isError ? (
          <p className="mt-4 text-sm text-rose-600">
            Couldn&apos;t load strands. Please retry.
          </p>
        ) : null}
      </SelectionBoardFrame>
    </div>
  );
};

export default ShsSelectionBoard;
