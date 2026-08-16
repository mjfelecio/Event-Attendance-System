"use client";

import { useState, type ReactNode } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";

import { cn } from "@/globals/libs/shad-cn";
import { surface, type as typeToken } from "@/globals/constants/designTokens";

/**
 * Page furniture for the /design-system route only.
 *
 * These components exist to *display* the design system. They are deliberately
 * not part of it — don't import them into product screens.
 */

type SectionProps = {
  /** Anchor id, used by the sticky nav. */
  id: string;
  title: string;
  /** One or two sentences on when this group of patterns applies. */
  intro?: string;
  children: ReactNode;
};

/** A top-level section of the playbook, with a scroll anchor. */
export const Section = ({ id, title, intro, children }: SectionProps) => (
  <section id={id} className="scroll-mt-24">
    <div className="mb-5">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
      {intro ? (
        <p className="mt-2 max-w-3xl text-sm text-slate-500">{intro}</p>
      ) : null}
    </div>
    <div className="flex flex-col gap-5">{children}</div>
  </section>
);

type SpecimenProps = {
  /** What this example is called. */
  title: string;
  /** Why it exists / when to reach for it. Keep to a sentence or two. */
  note?: ReactNode;
  /** Optional copyable snippet shown in a collapsible drawer. */
  code?: string;
  /** Renders the example on a slate background instead of white. */
  onSlate?: boolean;
  children: ReactNode;
};

/**
 * A single live example: rendered output, a short note, and an optional
 * collapsible code snippet.
 */
export const Specimen = ({
  title,
  note,
  code,
  onSlate = false,
  children,
}: SpecimenProps) => {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={cn(surface.card, "overflow-hidden")}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {note ? (
            <div className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500">
              {note}
            </div>
          ) : null}
        </div>
        {code ? (
          <button
            type="button"
            onClick={() => setShowCode((v) => !v)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            aria-expanded={showCode}
          >
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform",
                showCode && "rotate-180",
              )}
            />
            Code
          </button>
        ) : null}
      </div>

      <div
        className={cn(
          "px-5 py-6",
          onSlate ? "bg-slate-50" : "bg-white",
          // Examples wrap rather than overflow, so the page never scrolls
          // sideways on a narrow screen.
          "flex flex-wrap items-start gap-4",
        )}
      >
        {children}
      </div>

      {code && showCode ? (
        <div className="relative border-t border-slate-100 bg-slate-950">
          <button
            type="button"
            onClick={copy}
            className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            {copied ? (
              <Check className="size-3.5" />
            ) : (
              <Copy className="size-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
          <pre className="overflow-x-auto px-5 py-4 pr-24 text-xs leading-relaxed text-slate-200">
            <code>{code}</code>
          </pre>
        </div>
      ) : null}
    </div>
  );
};

/** Labels a single item inside a Specimen's example row. */
export const SpecimenItem = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="flex min-w-0 flex-col items-start gap-2">
    <div className="flex min-h-9 items-center">{children}</div>
    <span className="font-mono text-[11px] text-slate-400">{label}</span>
  </div>
);

/**
 * A "do this / not that" callout. Used sparingly — only where the audit found
 * an actual mistake being made repeatedly.
 */
export const Guidance = ({
  kind,
  children,
}: {
  kind: "do" | "dont";
  children: ReactNode;
}) => (
  <p
    className={cn(
      "flex gap-2 text-xs leading-relaxed",
      kind === "do" ? "text-emerald-700" : "text-rose-700",
    )}
  >
    <span aria-hidden className="font-semibold">
      {kind === "do" ? "Do" : "Don't"}
    </span>
    <span className="text-slate-600">{children}</span>
  </p>
);

/** Section-level heading inside a Specimen body, for grouped examples. */
export const SubHeading = ({ children }: { children: ReactNode }) => (
  <p className={cn(typeToken.eyebrow, "w-full")}>{children}</p>
);
