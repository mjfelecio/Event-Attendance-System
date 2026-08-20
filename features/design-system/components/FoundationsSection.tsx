"use client";

import { cn } from "@/globals/libs/shad-cn";
import {
  focusRing,
  page,
  pill,
  surface,
  type as typeToken,
} from "@/globals/constants/designTokens";

import { Guidance, Section, Specimen } from "./Specimen";

const INDIGO_SCALE = [
  { step: "50", cls: "bg-indigo-50", use: "Chip fills, subtle wash" },
  { step: "100", cls: "bg-indigo-100", use: "Eyebrow text on dark hero" },
  { step: "200", cls: "bg-indigo-200", use: "Chip + hover borders" },
  { step: "400", cls: "bg-indigo-400", use: "Focus ring" },
  { step: "500", cls: "bg-indigo-500", use: "Primary hover, accent dots" },
  { step: "600", cls: "bg-indigo-600", use: "PRIMARY — actions, eyebrows" },
  { step: "700", cls: "bg-indigo-700", use: "Chip text, emphasis numerals" },
];

// Written out rather than built from a template string: Tailwind only ships
// classes it can find as complete literals in the source. Constructing
// `bg-slate-${step}` at runtime silently produces unstyled swatches — the same
// bug that made past calendar events render as blank bars.
const SLATE_SCALE = [
  { step: "900", cls: "bg-slate-900" },
  { step: "700", cls: "bg-slate-700" },
  { step: "600", cls: "bg-slate-600" },
  { step: "500", cls: "bg-slate-500" },
  { step: "400", cls: "bg-slate-400" },
  { step: "200", cls: "bg-slate-200" },
  { step: "100", cls: "bg-slate-100" },
  { step: "50", cls: "bg-slate-50" },
];

const TONES = [
  {
    name: "neutral",
    swatch: "bg-slate-400",
    chip: "border-slate-200 bg-white text-slate-600",
    meaning: "Counts, inert metadata",
  },
  {
    name: "primary",
    swatch: "bg-indigo-500",
    chip: "border-indigo-200 bg-indigo-50 text-indigo-700",
    meaning: "The app's own emphasis",
  },
  {
    name: "info",
    swatch: "bg-blue-500",
    chip: "border-blue-200 bg-blue-50 text-blue-700",
    meaning: "In progress · Event PENDING",
  },
  {
    name: "success",
    swatch: "bg-emerald-500",
    chip: "border-emerald-200 bg-emerald-50 text-emerald-700",
    meaning: "Done · Present · Event APPROVED",
  },
  {
    name: "warning",
    swatch: "bg-amber-500",
    chip: "border-amber-200 bg-amber-50 text-amber-700",
    meaning: "Needs attention · Event DRAFT",
  },
  {
    name: "danger",
    swatch: "bg-rose-500",
    chip: "border-rose-200 bg-rose-50 text-rose-700",
    meaning: "Failure · Absent · Event REJECTED",
  },
];

const FoundationsSection = () => (
  <Section
    id="foundations"
    title="Foundations"
    intro="Colour, type, and surface treatments. Everything else in this playbook is built out of these."
  >
    <Specimen
      title="Primary colour — Tailwind indigo"
      note={
        <>
          <strong>indigo-600 is the primary colour.</strong> Use the stock
          Tailwind indigo scale; never introduce a bespoke primary hex. The
          shadcn <code>--primary</code> token now resolves to indigo-600, so{" "}
          <code>&lt;Button&gt;</code>, <code>&lt;Checkbox&gt;</code>, and{" "}
          <code>&lt;Switch&gt;</code> inherit it automatically.
        </>
      }
    >
      <div className="flex w-full flex-wrap gap-3">
        {INDIGO_SCALE.map((s) => (
          <div key={s.step} className="flex min-w-[132px] flex-1 flex-col gap-2">
            <div
              className={cn(
                "h-14 rounded-xl border border-black/5",
                s.cls,
                s.step === "600" && "ring-2 ring-indigo-600 ring-offset-2",
              )}
            />
            <div>
              <p className="font-mono text-[11px] font-semibold text-slate-700">
                indigo-{s.step}
              </p>
              <p className="text-[11px] leading-snug text-slate-500">{s.use}</p>
            </div>
          </div>
        ))}
      </div>
    </Specimen>

    <Specimen
      title="Semantic tones"
      note="Pick a tone by meaning, not by preferred hue. These six cover every status in the app — an Event status, an attendance result, a toast, a metric card all resolve to one of them."
    >
      <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TONES.map((t) => (
          <div
            key={t.name}
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
          >
            <span className={cn("size-8 shrink-0 rounded-lg", t.swatch)} />
            <div className="min-w-0">
              <span
                className={cn(
                  "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                  t.chip,
                )}
              >
                {t.name}
              </span>
              <p className="mt-1 text-[11px] leading-snug text-slate-500">
                {t.meaning}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Specimen>

    <Specimen
      title="Neutrals"
      note="Slate throughout. slate-900 for headings, slate-600 for body, slate-500 for supporting copy, slate-200 for borders, slate-50 for inset surfaces."
    >
      <div className="flex w-full flex-wrap gap-3">
        {SLATE_SCALE.map((s) => (
          <div key={s.step} className="flex flex-1 flex-col gap-2">
            <div
              className={cn(
                "h-12 min-w-[76px] rounded-xl border border-black/5",
                s.cls,
              )}
            />
            <p className="font-mono text-[11px] text-slate-500">
              slate-{s.step}
            </p>
          </div>
        ))}
      </div>
    </Specimen>

    <Specimen
      title="Typography"
      note="Poppins (--font-sans) throughout. The eyebrow + title pair is the app's signature header treatment."
      code={`import PageHeader from "@/globals/components/shared/PageHeader";

<PageHeader
  eyebrow="Student Directory"
  title="Student's List"
  description="Choose a category to manage its roster."
/>`}
    >
      <div className="w-full space-y-5">
        <div>
          <p className={typeToken.eyebrow}>Eyebrow · uppercase 0.2em</p>
          <h1 className={typeToken.pageTitle}>Page title · 3xl → 4xl</h1>
          <p className={typeToken.pageSubtitle}>
            Page subtitle · sm, slate-500, one sentence.
          </p>
        </div>
        <div className="border-t border-slate-100 pt-4">
          <h3 className={typeToken.sectionTitle}>Section title · lg semibold</h3>
          <p className="mt-1 text-sm text-slate-600">
            Body copy · sm, slate-600. Used for readable prose inside panels.
          </p>
          <p className={cn(typeToken.muted, "mt-1")}>
            Muted · sm, slate-500. Supporting detail and helper text.
          </p>
        </div>
      </div>
    </Specimen>

    <Specimen
      title="Surfaces & elevation"
      note="Three levels only: the page background, the panel that holds content, and the card inside it. Radii step down with nesting — 3xl panel, 2xl card."
      onSlate
      code={`import { surface } from "@/globals/constants/designTokens";

<div className={surface.panel}>
  <div className={surface.panelGlow} />
  <div className="relative p-6">…</div>
</div>`}
    >
      <div className="w-full space-y-4">
        <div className={cn(surface.panel, "p-5")}>
          <div className={surface.panelGlow} />
          <div className="relative">
            <p className="text-xs font-semibold text-slate-700">
              surface.panel — rounded-3xl, soft elevation, indigo glow
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <div className={cn(surface.card, "flex-1 p-4")}>
                <p className="text-xs font-semibold text-slate-700">
                  surface.card
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Static content unit.
                </p>
              </div>
              <div className={cn(surface.cardInteractive, "flex-1 p-4")}>
                <p className="text-xs font-semibold text-slate-700">
                  surface.cardInteractive
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Hover me — lifts and turns indigo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Specimen>

    <Specimen
      title="Focus & interaction"
      note="Every custom interactive element needs a visible focus ring. shad-cn primitives carry their own; hand-rolled elements should use the shared token."
      code={`import { focusRing } from "@/globals/constants/designTokens";

<button className={cn("...", focusRing)}>Action</button>`}
    >
      <div className="flex flex-wrap items-center gap-4">
        <button type="button" className={cn(pill.primary, focusRing)}>
          Tab to me
        </button>
        <button type="button" className={cn(pill.secondary, focusRing)}>
          And me
        </button>
        <div className="w-full space-y-1 pt-2">
          <Guidance kind="do">
            keep the indigo focus ring on custom buttons, links, and cards that
            act as links.
          </Guidance>
          <Guidance kind="dont">
            remove outlines without replacing them — keyboard users are the only
            way some organizers can operate a shared laptop at an event.
          </Guidance>
        </div>
      </div>
    </Specimen>

    <Specimen
      title="Page shell"
      note="The canonical full-page wrapper. Student List and Dashboard use it; Attendance, Reports, and Calendar currently don't (see Known deviations)."
      code={`import { page } from "@/globals/constants/designTokens";

<section className={page.surface}>
  <div className={page.container}>…</div>
</section>`}
    >
      <div className="w-full overflow-hidden rounded-xl border border-slate-200">
        <div className={cn(page.surface, "p-5")}>
          <div className={cn(page.container, "gap-3")}>
            <div className="rounded-xl border border-dashed border-indigo-300 bg-white/70 px-4 py-3 text-center text-xs font-medium text-indigo-600">
              page.container · max-w-6xl, centred, gap-6
            </div>
            <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 py-6 text-center text-xs text-slate-500">
              content
            </div>
          </div>
        </div>
      </div>
    </Specimen>
  </Section>
);

export default FoundationsSection;
