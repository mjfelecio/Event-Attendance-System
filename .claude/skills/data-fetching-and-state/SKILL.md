---
name: data-fetching-and-state
description: TanStack Query conventions for the Event Attendance System — hook file organization, the queryKeys factory, cache invalidation rules (including deliberate over-invalidation), live polling, and the wire-format Date transform pattern. Use whenever adding or editing a globals/hooks or features/*/hooks file, or any component that fetches/mutates server data.
---

# Data Fetching & State (TanStack Query)

## Where hooks live and how they're named

One file per domain in `globals/hooks/` (`useEvents.ts`, `useStudents.ts`,
`useRecords.ts`, `useAdmin.ts`, `useGroups.ts`) for anything shared across features;
`features/*/hooks/` for a fetch used by exactly one feature. Naming:
`useX`/`useFetchX`/`useXFromY` for queries, `useSaveX`/`useDeleteX`/`useXAction` for
mutations — see `docs/conventions.md`'s "How do I fetch/mutate server data?" for the
full breakdown.

**Every** query/mutation calls `fetchApi<T>()` (`globals/utils/api.ts`), never raw
`fetch` — it unwraps the `{success,data}` envelope and throws a typed `ApiError`.

## Cache invalidation — the `queryKeys` factory is load-bearing, and over-invalidation is intentional

`globals/utils/queryKeys.ts` is the preferred source of query keys. Two things you
must understand before adding or changing invalidation logic, because both look like
bugs if you don't know the reasoning:

1. **Prefix keys are deliberate.** `queryKeys.records.fromEventPrefix(eventId)` is
   shorter than `queryKeys.records.fromEvent(eventId, includeAbsent)` on purpose —
   TanStack Query invalidates by prefix match, so invalidating the prefix refreshes
   *both* the live present-only attendance table and the report's present+absent
   variant in one call. If you add a new key with a boolean/variant suffix, decide
   whether callers usually want "all variants" (add a prefix helper) or "just this one."
2. **`invalidateStudentDependents()` in `useStudents.ts` deliberately over-invalidates**:
   every student save/delete invalidates students, student stats, **all events**, and
   **all records** — because eligibility is computed live from the roster (see the
   `project-orientation` skill), so a roster edit really can change every downstream
   stat and report. **Do not narrow this "for efficiency"** without first confirming
   the narrower set still covers every screen that reads eligibility-derived data —
   under-invalidating here produces stale attendance numbers, which is a much worse
   failure mode than an extra refetch.

**Known inconsistency, don't be surprised by it**: `globals/hooks/useGroups.ts` and one
query in `useStudents.ts` use inline key arrays instead of the `queryKeys` factory. If
you're adding a new groups-related query, prefer extending `queryKeys.ts` with a
`groups:` section (matching the shape of `events`/`students`/`records`) over adding
another inline array — but the existing inline ones aren't broken, just inconsistent.

## Live polling is opt-in per-query, not a global default

`useFetchEvent`, `useStatsOfEvent`, `useAllRecordsFromEvent` take a `live` boolean.
Only the attendance screen (where someone might be actively scanning on a *different*
device) passes `true`, spreading in `{ staleTime: 5_000, refetchInterval: 8_000,
refetchIntervalInBackground: false }`. Report/history views deliberately don't poll —
a finished event's data doesn't need to refresh every 8 seconds. Follow this pattern:
default to no polling, opt in only for screens where a second device's write needs to
show up live.

## The wire-format Date transform pattern — required for any new fetched type with dates

JSON has no `Date` type, so API responses carry dates as ISO strings. Every hook
returning date-bearing data defines a small `transformX` function converting strings →
`Date` before handing data to components (`transformEvent` in `useEvents.ts`,
`transformStudent` in `useStudents.ts`). The matching type pair is `X` (real `Date`
fields, what components consume) vs `XAPI`/`XDTO` (string fields, the literal wire
shape) — see `globals/types/events.ts` (`Event`/`EventAPI`) and
`globals/types/students.ts` (`Student`/`StudentDTO`). **If you add a new fetched type
with a date field, add this pair and transform — don't trust `Date` fields straight out
of a raw `fetch`/`.json()` call**, they'll actually be strings at runtime despite what
TypeScript says if you skip this.

## Known exception — don't extend it

`features/manage-list/components/StudentImporter.tsx` bypasses all of the above: raw
`fetch()` inline in the component, manual envelope parsing, manual
`queryClient.invalidateQueries()` calls. This is a genuine inconsistency, not a
considered exception — new bulk-mutation code should use a `useMutation` hook (mirroring
`useSaveStudent`), not copy this component's approach.

## Optimistic updates — be careful, this codebase has a documented near-miss

`useUpdateAttendanceRecord` in `globals/hooks/useRecords.ts` deliberately avoids an
optimistic cache write because the records cache holds *enriched* rows
(`StudentAttendanceRecord`, with denormalized `fullName`/`schoolLevel`/`section`) that a
mutation's raw input can't reconstruct — an earlier optimistic-append attempt corrupted
and duplicated rows in timeout mode. If you add optimistic updates to a query whose
cache shape is enriched/denormalized beyond the mutation's input shape, read that
hook's comment first; it's there because this specific mistake already happened once.
