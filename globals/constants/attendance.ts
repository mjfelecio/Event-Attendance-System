/**
 * Constants for derived attendance reporting.
 *
 * The database stores no attendance status — `Record` has `timein`/`timeout` and
 * nothing else, and absence has no row at all (see `docs/domain-model.md`
 * §"Derived concepts"). Everything richer than present/absent is *derived*, and
 * the rules it derives from live here so there is exactly one place to change
 * them.
 *
 * @see globals/utils/attendance.ts — the functions that apply these
 * @see docs/plans/reports-overhaul.md
 */

/**
 * Minutes after an event's `start` that a time-in still counts as on time.
 *
 * Attendance is deliberately writable outside the event window (`domain-model.md`
 * rule 3 — there is no start/end restriction), so a `timein` may legitimately land
 * *before* `start`. That is early, not late; only the upper bound is checked.
 *
 * All-day events are exempt entirely — their `start` is normalized to midnight, so
 * every attendee would read as late. See `deriveOutcome`.
 */
export const LATE_GRACE_MINUTES = 15;

/**
 * Width of one bar in the arrival timeline, in minutes.
 *
 * Fine enough to show the rush at an event's opening, coarse enough that a
 * two-hour event doesn't become a hundred near-empty bars.
 */
export const ARRIVAL_BUCKET_MINUTES = 15;

/**
 * Upper bound on the arrival timeline's length.
 *
 * The timeline fills empty buckets so a gap reads as "nobody arrived" rather than
 * silently collapsing. Because a stray scan hours or days after an event would
 * otherwise generate an unbounded series, gap-filling is skipped once the span
 * exceeds this many buckets (96 × 15min = 24h).
 */
export const MAX_ARRIVAL_BUCKETS = 96;

/**
 * Chart colours, as literal hex values.
 *
 * Recharts styles via CSS values, not class names, so these cannot come from
 * Tailwind classes — and **must not** be assembled at runtime (`bg-${x}-500`
 * ships unstyled; this has already caused a real bug in the calendar).
 *
 * The values mirror the design system's semantic tones so a chart and a
 * `StatusBadge` describing the same thing agree:
 * present → success (emerald), late → warning (amber), absent → danger (rose),
 * with indigo-600 as the app's primary.
 *
 * @see docs/design-system.md — "Semantic tones"
 */
/**
 * The present/late/absent trio was chosen by running the `dataviz` palette
 * validator, not by eye. Against a light surface it scores:
 *
 * - colour-vision-deficient separation ΔE **19.3** (protan/deutan) — comfortable pass
 * - normal-vision separation ΔE 19.3 — pass
 * - contrast: `late` (amber-500) sits at 2.09:1, below the 3:1 bar
 *
 * That last point is a real obligation, not a nit: **every chart using these must
 * carry visible labels or an accompanying table**, so identity never rests on the
 * amber fill alone. The status donut ships a labelled legend with counts, and the
 * records table below it is the table view. Darker ambers clear the contrast bar
 * but collapse CVD separation to ΔE 7.9 — indistinguishable from the green for a
 * protanope, which is the worse failure.
 */
export const CHART_COLORS = {
  /** indigo-600 — the app's primary; the single-series colour */
  primary: "#4f46e5",
  /** emerald-700 — present / on time */
  present: "#047857",
  /** amber-500 — late (see the contrast obligation above) */
  late: "#f59e0b",
  /** rose-600 — absent */
  absent: "#e11d48",
  /** slate-400 — inert series */
  neutral: "#94a3b8",
  /** slate-200 — grid lines, kept recessive */
  grid: "#e2e8f0",
  /** slate-500 — axis labels */
  axis: "#64748b",
} as const;
