"use client";

import Link from "next/link";
import { AlertTriangle, BookOpen, Bot, Smartphone } from "lucide-react";

import { cn } from "@/globals/libs/shad-cn";
import { surface, type as typeToken } from "@/globals/constants/designTokens";
import StatusBadge from "@/globals/components/shared/StatusBadge";

import { Section } from "./Specimen";

const AI_RULES = [
  "Consult this playbook (and docs/design-system.md) before creating any new UI.",
  "Prefer an existing reusable component over writing a new one.",
  "Follow the established page-level patterns rather than inventing a layout.",
  "Use the documented colour, spacing, typography, and interaction tokens.",
  "Don't introduce arbitrary new visual styles because they're convenient.",
  "Don't add a new component when an existing one satisfies the requirement.",
  "If a genuinely new pattern is needed, propose it as an addition to the system.",
  "Treat the Manage List pages and this page as the canonical visual references.",
  "Preserve the existing architecture unless there's a concrete benefit to changing it.",
  "Prefer incremental improvements over rewrites.",
];

const RESPONSIVE_RULES = [
  {
    title: "Breakpoints in use",
    body: "sm 640 · md 768 · lg 1024 · xl 1280. Manage List steps padding at md (p-6 → md:p-8) and titles at md (3xl → md:4xl). Toolbars collapse at lg/xl.",
  },
  {
    title: "Mobile-first classes",
    body: "Write the narrow layout first, then add md:/lg: overrides. Don't start from desktop and bolt on max-width overrides.",
  },
  {
    title: "Never overflow the page",
    body: "Wide content (tables, toolbars, chip rows) scrolls inside its own container. The page body itself must never scroll horizontally.",
  },
  {
    title: "Stack, don't shrink",
    body: "Toolbar rows go flex-col by default and flex-row at lg/xl. Shrinking controls below their tap target is worse than stacking them.",
  },
  {
    title: "Tap targets",
    body: "The attendance screen is operated on phones. Keep interactive targets ≥ 40px in any flow an organizer uses during an event.",
  },
];

const NEEDS_RESPONSIVE_WORK = [
  "Manage List toolbar — action pills wrap but the search field competes for room below md.",
  "StudentsDataTable — no horizontal scroll container; wide rosters overflow on phones.",
  "Attendance page — the primary mobile surface, but built at desktop width.",
  "Calendar — FullCalendar's month grid is unusable below sm without a view switch.",
  "Dashboard metric row — four cards across doesn't collapse cleanly on small tablets.",
];

const DEVIATIONS = [
  {
    tone: "warning" as const,
    title: "Two table implementations",
    body: "StudentsDataTable (Manage List) and the shared DataTable share no code. Use the shared DataTable for anything new.",
  },
  {
    tone: "warning" as const,
    title: "Three page shells",
    body: "Manage List + Dashboard use the radial-gradient shell; Attendance uses flat bg-white p-6; Reports uses bare p-4. New pages use page.surface.",
  },
  {
    tone: "warning" as const,
    title: "Event status colours duplicated",
    body: "The Dashboard and the calendar's EventCard each define their own status→colour map, with slightly different shades. New code uses EVENT_STATUS_TONE.",
  },
  {
    tone: "info" as const,
    title: "Sheet and Drawer coexist",
    body: "Two vendored slide-in primitives fill the same role. Prefer Sheet for new panels.",
  },
  {
    tone: "info" as const,
    title: "Dark mode is dead code",
    body: "globals.css defines a .dark block and a prefers-color-scheme rule, but nothing ever activates them. Don't write dark: variants until dark mode is a real feature.",
  },
];

const GuidanceSection = () => (
  <Section
    id="guidance"
    title="Guidance"
    intro="How to apply this system — for people and for AI agents — plus what it deliberately doesn't cover yet."
  >
    {/* ------------------------------------------------------------ AI RULES */}
    <div className={cn(surface.panel, "p-6")}>
      <div className={surface.panelGlow} />
      <div className="relative">
        <div className="flex items-center gap-2">
          <Bot className="size-5 text-indigo-600" />
          <h3 className={typeToken.sectionTitle}>Rules for AI agents</h3>
        </div>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          If you are an AI agent asked to &quot;create a new screen for X&quot;,
          these are binding. The goal is that what you build looks like it
          belongs to this app rather than introducing another visual language.
        </p>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2">
          {AI_RULES.map((rule, i) => (
            <li
              key={rule}
              className="flex gap-3 rounded-xl border border-slate-200 bg-white/70 px-3 py-2.5"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <span className="text-xs leading-relaxed text-slate-600">
                {rule}
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50/60 px-4 py-3">
          <BookOpen className="size-4 shrink-0 text-indigo-600" />
          <p className="text-xs text-slate-600">
            Full written playbook:{" "}
            <code className="rounded bg-white px-1.5 py-0.5 text-[11px] font-semibold text-indigo-700">
              docs/design-system.md
            </code>{" "}
            · component API detail lives in JSDoc on the components themselves.
          </p>
        </div>
      </div>
    </div>

    {/* ---------------------------------------------------------- RESPONSIVE */}
    <div className={cn(surface.panel, "p-6")}>
      <div className={surface.panelGlow} />
      <div className="relative">
        <div className="flex items-center gap-2">
          <Smartphone className="size-5 text-indigo-600" />
          <h3 className={typeToken.sectionTitle}>Responsive principles</h3>
        </div>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          The app is <strong>not currently fully responsive</strong>, and making
          it so is a separate effort. These rules exist so new work doesn&apos;t
          deepen the problem.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {RESPONSIVE_RULES.map((r) => (
            <div
              key={r.title}
              className="rounded-xl border border-slate-200 bg-white/70 p-3"
            >
              <p className="text-xs font-semibold text-slate-800">{r.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {r.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <p className={typeToken.eyebrow}>Known to need responsive work</p>
          <ul className="mt-2 space-y-1.5">
            {NEEDS_RESPONSIVE_WORK.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-xs leading-relaxed text-slate-600"
              >
                <span aria-hidden className="text-slate-300">
                  •
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    {/* ---------------------------------------------------------- DEVIATIONS */}
    <div className={cn(surface.panel, "p-6")}>
      <div className={surface.panelGlow} />
      <div className="relative">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-5 text-amber-500" />
          <h3 className={typeToken.sectionTitle}>Known deviations</h3>
        </div>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          Places where the existing app doesn&apos;t follow this system. These
          are recorded, not fixed — establishing the target state is the point
          of this playbook, and a broad refactor is deliberately out of scope.
          Follow the &quot;preferred&quot; column in new work.
        </p>
        <div className="mt-4 space-y-2">
          {DEVIATIONS.map((d) => (
            <div
              key={d.title}
              className="flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-white/70 p-3 sm:flex-row sm:items-start sm:gap-3"
            >
              <StatusBadge tone={d.tone} className="w-fit shrink-0">
                {d.tone === "warning" ? "Deviation" : "Note"}
              </StatusBadge>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800">
                  {d.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                  {d.body}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Each of these has a tracked backlog issue — see{" "}
          <Link
            href="https://github.com/mjfelecio/Event-Attendance-System/issues?q=is%3Aissue+label%3Aui"
            className="font-semibold text-indigo-600 underline-offset-2 hover:underline"
          >
            the <code>ui</code> label
          </Link>
          .
        </p>
      </div>
    </div>
  </Section>
);

export default GuidanceSection;
