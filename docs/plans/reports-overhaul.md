# Reports Overhaul — Implementation Plan

> **Status: implemented** on branch `feat/reports-page-overhaul` (all six phases).
> Kept as the record of what was built and why. Verification results are at the
> bottom under [Verification](#verification).
> **Audience:** anyone changing `/reports` next. Read
> [`../design-system.md`](../design-system.md), [`../conventions.md`](../conventions.md),
> and [`../domain-model.md`](../domain-model.md) first — this plan assumes them.

---

## Context

**Reports are the system's actual output** — the artifact the school keeps, files, and
signs. Everything else in the app is data entry. Today the reports area is the least
developed part of the codebase.

- `app/(main)/reports/page.tsx` is **25 lines** with a bare `<h1>Reports Page</h1>`.
  **No search, no filters, no date range, no sort.** It lists every visible event
  oldest-first (`GET /api/events` → `orderBy: { start: "asc" }`), so the event you
  almost certainly want is at the bottom.
- There is **no cross-event reporting of any kind**. Every stats endpoint is scoped to
  one `eventId`. "How was turnout this week?" is unanswerable.
- The report surfaces only **Present / Eligible / Rate**. `Record.method`
  (`MANUAL | SCANNED`), `Record.recordedById`, and `Record.lastModifiedById` are all
  stored and surfaced **nowhere**. There is no notion of lateness.
- The print page is a plain table — **no letterhead, no signature column, no signatory
  block, no per-section subtotals**. It is not a document a school office can file.
- Attendance-rate math is **duplicated in four places**, and the print page
  **re-implements eligibility and stats against Prisma directly**.
  `conventions.md` calls this *"the single most important 'these two things must be
  changed together' relationship in the codebase"* — the screen and the printout can
  silently disagree.

**Outcome:** a reports hub with a real cross-event overview, a substantially richer
per-event report, and a genuine printable attendance sheet — all sharing **one**
server-side aggregation path so screen and paper cannot drift.

---

## Decisions (already made — do not relitigate)

| Decision | Choice |
|---|---|
| Scope beyond single event | **Cross-event overview** (date-range dashboard). *Not* per-student history; *not* standalone group/section rollup screens. |
| Print output | **Official attendance sheet** — letterhead, signature column, signatory block. |
| Charts | **Add Recharts** (`^3.10.1` — verified React 19 compatible). |
| Data model | **Derive Late / No-time-out.** No schema change. Eligibility snapshotting stays out of scope. |

Because eligibility snapshotting was declined, reports must **visibly state** that they
reflect the *current* roster — see
[DATA-06](../audit/data-integrity.md#data-06) (issue #45) and SEC-03 (issue #40). That
is one line of copy on screen and in the printed footer. It is not optional; without it
"why did last week's report change overnight" reads as a bug.

---

## Current state

| File | Lines | State |
|---|---|---|
| `app/(main)/reports/page.tsx` | 25 | Bare split view, no controls |
| `app/(main)/reports/events/[id]/page.tsx` | 138 | Detail report |
| `app/(main)/reports/events/[id]/print/page.tsx` | 83 | Server component, direct Prisma, own auth |
| `features/reports/components/EventsList.tsx` | 64 | Bespoke spinner / red div / empty markup |
| `features/reports/components/EventSummary.tsx` | 114 | Duplicates the detail page's stat cards |
| `features/reports/components/RecordsList.tsx` | 47 | Thin shared-`DataTable` wrapper |
| `features/reports/components/EventMetadataCard.tsx` | 61 | **Renders a raw cuid as "Organizer"** |
| `features/reports/components/PrintableEventReport.tsx` | 193 | Plain table |
| `features/reports/constants/eventRecordsTable.tsx` | 171 | `reportColumns` |

### Defects to fix along the way

1. `EventMetadataCard.tsx:13` renders `{event.createdById}` (a cuid) under "Organizer".
   `organizerName` is already on the payload.
2. `events/[id]/page.tsx:64` uses `w-4xl`. In Tailwind v4 this compiles to a **fixed**
   `width: 56rem` (verified in the built CSS), so the page scrolls horizontally below
   896px — violating the design system's *"the page body must never scroll horizontally"*.
3. Duplicate heading — the page renders `<h2>Attendance Records</h2>` **and** passes
   `title="Attendance Records"` to `DataTable`.
4. `PrintableEventReport.tsx:158` restarts row numbering at 1 in every section.
5. CSV export dumps raw API JSON, so `section` serialises as `[object Object]` and
   timestamps stay raw ISO strings.
6. The events list is sorted oldest-first with no way to reorder.

---

## Target architecture

### 1. One aggregation path (the load-bearing change)

Today the screen goes through the API while the print page queries Prisma itself.
Collapse both onto one server-side builder:

```
globals/utils/eventReport.ts   (import "server-only")
        │
        ├── GET /api/reports/events/[eventId]    → on-screen report (TanStack Query)
        └── app/(print)/…/print/page.tsx         → server-rendered attendance sheet
```

This retires the "must be changed together" hazard documented in `conventions.md`
§*How do I build a printable report?*.

### 2. Derived status model

`Record` has no status column and **gains none**. Derive in
`globals/utils/attendance.ts` — a plain util (no `server-only`), used on both sides:

```ts
export type AttendanceOutcome = "PRESENT" | "LATE" | "ABSENT";
```

- `ABSENT` — no record, or a record with no `timein`.
- `LATE` — `timein > event.start + LATE_GRACE_MINUTES`.
- `PRESENT` — otherwise.

Plus an orthogonal `noTimeout: boolean` (timed in, never timed out).

**Two rules that keep this honest — do not skip them:**

- **`allDay` events are never late.** Their `start` is normalised to midnight
  client-side, so every attendee would be flagged. For `allDay`, the outcome is only
  `PRESENT` / `ABSENT`.
- **Only flag missing time-outs when the event actually collected them.** Compute
  `expectsTimeout = event.isTimeout || records.some(r => r.timeout)` once per event.
  `Event.isTimeout` is a live *mode toggle*, not a declaration that time-out is
  required — without this guard every ordinary time-in-only event flags 100%
  "no time-out".

`LATE_GRACE_MINUTES = 15` lives in `globals/constants/attendance.ts` as one documented
constant. Note attendance has **no start/end window enforcement** (`domain-model.md`
rule 3), so a `timein` can legitimately precede `start`; that is early, not late.

The same util gets `attendanceRate(present, eligible)`, replacing the **four**
duplicated copies (attendance header, `EventSummary`, event report page,
`PrintableEventReport`) — all of which already agree on "`—` when eligible is 0".

### 3. New API namespace

Leave `/api/events/[eventId]/stats` and `/api/events/[eventId]/records` **untouched**.
The live attendance screen polls them, and it is the one screen operated under time
pressure by someone who didn't build the app. All new work lands under `/api/reports/*`.

**`GET /api/reports/events/[eventId]`**

```ts
{
  event, expectsTimeout,
  totals: { eligible, present, late, absent, noTimeout, scanned, manual },
  rate,
  arrivals: { bucketStart, count }[],   // 15-minute buckets
  bySection: { name, eligible, present, late, absent }[],
  rows: ReportRow[]                     // + yearLevel, method, outcome, noTimeout
}
```

`bySection` exists because the printed sheet needs subtotals — it is **not** a separate
on-screen rollup feature (that stayed out of scope).

**`GET /api/reports/overview?from=&to=&category=`**

```ts
{
  range, totals: { events, presentSum, eligibleSum, averageRate },
  best, worst,
  events: { id, title, start, category, status, present, eligible, rate }[],
  byCategory: { category, events, averageRate }[]
}
```

One call powers the overview cards, both charts, **and** the hub's event table.

Both routes follow `app/api/events/[eventId]/stats/route.ts`: `requireAuth()` →
`assertEventVisibility(event, user)`, responses through `ok()` / `err()`
(`globals/utils/api.ts`), errors through `respondWithError()`
(`globals/utils/httpError.ts`).

> **Authorization is the sharp edge on the overview.** Reuse the exact visibility clause
> from `app/api/events/route.ts` — admins see everything, organizers see
> `OR: [{ createdById: me }, { status: "APPROVED" }]`. Aggregating over events the
> caller cannot open would leak other organizers' drafts.

**Performance.** Eligible counts need one query per distinct event scope. Memoise by a
filter signature within the request (every `ALL` / `COLLEGE` / `SHS` event shares one
count), run the remainder with `Promise.all`, validate `from`/`to` with Zod, and **cap
the range** (reject > 1 year). At this deployment's scale — one school week, a single
SQLite file — that is comfortably sufficient. No schema or index work is required.

### 4. Recharts

- Add `recharts@^3.10.1`.
- **Charts render on screen only, never on the print page.** `ResponsiveContainer`
  measures the DOM and commonly renders blank or mis-sized in print. The printed
  attendance sheet is tables and numbers by design.
- Load chart components via `next/dynamic` — precedent:
  `features/attendance/components/Scanner.tsx` does this for the QR library.
- Give every chart an explicit height and wrap it in an `overflow-x-auto` container.
- Colours come from a **static** `CHART_COLORS` map of hex values in
  `globals/constants/attendance.ts`, aligned to the app's tones (indigo-600 primary;
  emerald present, amber late, rose absent). Recharts takes CSS values, not classes —
  **never build a Tailwind class name at runtime.**

### 5. Design system

Reports currently sits on the design system's *Known deviations* list for its `p-4`
shell. **This overhaul is explicitly chartered to fix that** (rule #10's "don't do it as
an unrequested side effect" does not apply here). Both pages adopt `page.surface` +
`page.container` / `containerWide`, `PageHeader`, `StatusBadge`, `pill.back`, and the
shared states in `globals/components/shared/dataTable/DataTableStates.tsx` — replacing
the bespoke spinner / red-div / empty markup in `EventsList` and `EventSummary`.

**One genuinely new shared component**, proposed explicitly per design-system rule #7:
`globals/components/shared/DateRangePicker.tsx`, composed from two existing
`features/calendar/components/DatePicker.tsx` instances. The app has no range picker,
and the overview cannot work without one.

---

## Implementation phases

### Phase 1 — Foundation (no UI change)

1. `globals/constants/attendance.ts` — `LATE_GRACE_MINUTES`, `CHART_COLORS`.
2. `globals/utils/attendance.ts` — `deriveOutcome`, `attendanceRate`, `expectsTimeout`.
3. Replace the four duplicated rate calculations with `attendanceRate`.
4. `globals/utils/eventReport.ts` (`server-only`) — `buildEventReport(event)`, reusing
   `buildEventStudentFilter` (`globals/utils/buildEventStudentFilter.ts`) and `fullName`
   (`globals/utils/formatting.ts`).
5. `globals/utils/reportsOverview.ts` (`server-only`) —
   `buildOverview({ from, to, category, user })`.

### Phase 2 — API

6. `app/api/reports/events/[eventId]/route.ts`
7. `app/api/reports/overview/route.ts` — Zod query schema modelled on `listQuerySchema`
   in `app/api/events/route.ts` (the only existing route with validated query params).
8. `globals/utils/queryKeys.ts` — add a `reports` namespace
   (`reports.event(id)`, `reports.overview(from, to, category)`).
9. `features/reports/hooks/useEventReport.ts`, `useReportsOverview.ts` — follow the
   `transformEvent` wire-format Date pattern in `globals/hooks/useEvents.ts`.
   Reports deliberately **do not poll** (`conventions.md`).

### Phase 3 — Recharts + the hub

10. `pnpm add recharts@^3.10.1`
11. `globals/components/shared/DateRangePicker.tsx`
12. `features/reports/components/overview/` — `OverviewMetrics`, `TrendChart`,
    `CategoryChart`, `DateRangeControls`.
13. Rewrite `app/(main)/reports/page.tsx`: `page.surface` + `containerWide`, hero
    `PageHeader`, overview panel, then a filterable event `DataTable`
    (Date · Event · Category · Status · Turnout · View) sorted **most recent first**.
14. Delete `EventSummary.tsx` (it duplicated the detail page); repurpose/retire
    `EventsList.tsx`.

### Phase 4 — Event report page

15. `features/reports/components/event/` — `ReportMetrics`, `StatusDonut`,
    `ArrivalTimelineChart`, `DataQualityStrip` (scanned vs manual, as `StatusBadge`s).
16. `features/reports/constants/reportTable.tsx` — new columns including outcome badge,
    no-time-out flag, method, year level. Reduce relations with `accessorFn`; a raw
    relation object has crashed this table before (React error #31).
17. Rewrite `app/(main)/reports/events/[id]/page.tsx` — design-system shell, fix the
    `w-4xl` overflow, drop the duplicate heading, add status/section facet filters via
    `DataTable`'s `toolbar` slot, add the current-roster caveat line.
18. Fix `EventMetadataCard.tsx` to use `organizerName`.
19. `globals/hooks/useDataExport.ts` — add an optional `mapRow` transform; point the CSV
    export at flat, human-labelled columns with formatted dates.
    **Keep `escapeCsvFormulas`** — `conventions.md` requires every export path to retain
    the formula-injection guard.

### Phase 5 — The printable attendance sheet

20. New route group `app/(print)/layout.tsx` — minimal white shell, no sidebar, no
    auth-gate flash. Move the page to `app/(print)/reports/events/[id]/print/page.tsx`
    (route groups don't change the URL, and the two paths don't collide) and delete the
    old one. **Keep its server-side auth exactly as-is** — `getFreshAuthSession()` plus
    the inline visibility check — because the client `(main)` layout is not a security
    boundary. It now calls `buildEventReport` instead of querying Prisma itself.
21. `features/reports/components/print/AttendanceSheet.tsx` replaces
    `PrintableEventReport.tsx`:
    - **Letterhead** — `/logos/school/aclc.png`, school name, "EVENT ATTENDANCE SHEET".
    - Event metadata + summary line (Eligible / Present / Late / Absent / Rate).
    - Roster grouped by section, **continuous numbering**, per-section subtotal rows.
      Columns: No. · Student No. · Name · Year · Time In · Time Out · Status ·
      **Signature**.
    - **Signatory block** — "Prepared by" (organizer) / "Noted by".
    - Footer — generated timestamp + the current-roster caveat.
22. `features/reports/components/print/PrintOptionsBar.tsx` — a `.no-print` client
    component driving URL search params the server page reads: include absentees,
    include signature column, group by section, plus a `window.print()` button.
    (There is currently **no `window.print()` anywhere in the repo** — printing is
    manual Ctrl+P today.)
23. Reuse the existing print CSS in `app/globals.css:396–421` (`@page A4 portrait`,
    `.print-table thead { display: table-header-group }`, `.print-break-inside-avoid`).
    **Page numbers:** Chrome does not support `@page` counters for HTML content, so rely
    on the browser's own print header/footer rather than faking it. Document that rather
    than shipping something that silently doesn't work.

### Phase 6 — Docs

24. `docs/design-system.md` — drop Reports from the *Known deviations* shell row;
    document the chart pattern and `DateRangePicker` as system additions.
25. `docs/conventions.md` — rewrite *How do I build a printable report?*: screen and
    print now share `buildEventReport`.
26. `docs/architecture.md` — document the `/api/reports/*` namespace.

---

## Verification

**There is no automated test suite.** Type-checking and linting passing is *not*
evidence anything works — exercise the UI in a browser.

```bash
npx tsc --noEmit
pnpm lint
pnpm build          # required before finishing
pnpm db:seed        # sample students, events, records (DESTRUCTIVE — wipes all tables)
pnpm dev
```

Sign in as `admin@gmail.com` / `adminama123` and `organizer@example.com` / `password`.

**Correctness**

- The rate on `/reports`, on the event report, and on the printout are **identical** for
  the same event, and match `GET /api/events/[eventId]/stats` (kept as the control).
- Per-section subtotals on the sheet sum to the header totals.
- An `allDay` event reports **zero** Late.
- A time-in-only event reports **zero** "no time-out" (`expectsTimeout` false).
- A `YEAR`-category event matches zero students → rate renders `—`, no divide-by-zero.
- Overview totals are restricted to the selected range; `from > to` and a > 1-year range
  are rejected with a 400.

**Authorization**

- As an organizer, the overview and hub list contain only own + `APPROVED` events — no
  other organizer's drafts.
- Log out, then request `/reports/events/<id>/print` directly → redirects to `/login`.

**Print** (Ctrl+P preview)

- No sidebar, top bar, or bottom nav.
- Table headers repeat on every page; rows don't split across pages.
- Numbering is continuous across sections.
- Signature column and signatory block present; the options bar is absent.

**Responsive** — at **375px**, neither `/reports` nor `/reports/events/[id]` scrolls
horizontally (this is the `w-4xl` fix); charts and tables scroll inside their own
containers.

The `webapp-testing` skill (Playwright) covers the browser passes and screenshots.

---

## Out of scope (deliberate)

- Per-student attendance history — `queryKeys.records.fromStudent` remains an unused slot.
- Standalone group/section rollup screens.
- Eligibility snapshotting ([DATA-06](../audit/data-integrity.md#data-06) / #45) —
  addressed with a visible caveat, not a schema change.
- Migrating the Dashboard's local `MetricCard` or the legacy `StudentsDataTable`.
- The attendance page's deliberately disabled Export button.
