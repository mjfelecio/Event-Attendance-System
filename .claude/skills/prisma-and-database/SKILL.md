---
name: prisma-and-database
description: Prisma/SQLite conventions for the Event Attendance System — schema change workflow, migration generation, transaction pitfalls, the compare-and-set concurrency pattern, and seed script danger. Use whenever touching prisma/schema.prisma, prisma/migrations, prisma/seed.ts, any $transaction, or writing a new Prisma query.
---

# Prisma & Database Conventions

## The database is SQLite via a driver adapter — not the classic Prisma engine

`globals/libs/prisma.ts` constructs `PrismaClient` with `@prisma/adapter-better-sqlite3`,
not the default engine. There is exactly one `PrismaClient` singleton — never
instantiate one yourself. It throws at import time if `DATABASE_URL` is unset,
deliberately, so a misconfigured deployment fails loudly instead of silently running
against an empty in-memory database. Keep that fail-fast behavior if you touch this file.

## Concurrency: compare-and-set, not transactions, for attendance writes

Every attendance timestamp write (`timein`, `timeout`, the `isTimeout` toggle) uses
`updateMany` with a condition in `where` — e.g.
`prisma.record.updateMany({ where: { id, timein: null }, data: { timein: now } })` —
followed by a re-read, instead of `update` inside a transaction. This is deliberate: it
makes concurrent scans converge correctly (two organizers scanning the same student at
the same instant produce one record, not a race) **without** holding SQLite's
single-writer lock during a scan burst. This is the load-bearing invariant that
prevents duplicate/lost attendance — see `docs/architecture.md` §12 and §18, and
`docs/audit/data-integrity.md`'s "Explicitly checked and found sound" section for why
it's verified correct.

**If you add a new "write this value once" field, use this pattern, not a
transaction.** Reaching for `$transaction` to solve a "don't double-write" problem
here is over-engineering for this codebase's own established idiom.

## Transactions are rare, and the one real example has a known problem — don't copy it blindly

`app/api/bulk-import/students/route.ts` uses the **array** form of `$transaction`
(a list of pre-built upsert promises, not a callback). It does not override Prisma's
default `timeout` (5s) / `maxWait` (2s). At 2,000+ rows with relation writes
(`groups.set`/`.connect`), this is very likely to exceed the timeout and roll back the
entire batch with one opaque error and zero partial-success information — this is
**`DATA-01`, a confirmed P0 release blocker**, not a hypothetical. See
`docs/audit/data-integrity.md#data-01` before adding a new bulk operation. If you add
one, pass an explicit longer `timeout`, or use the *interactive* callback form
(`prisma.$transaction(async (tx) => {...})`) for more control — don't replicate the
array-form-with-default-timeout pattern.

## Schema changes: always generate migrations, never hand-write SQL

Run `pnpm db:migrate` (wraps `prisma migrate dev`) after editing `schema.prisma`. Every
migration in `prisma/migrations/` is generator output — several use SQLite's
`PRAGMA defer_foreign_keys` table-rebuild pattern (recreate table → copy data →
drop/rename) because SQLite can't do most `ALTER TABLE`s directly. This is
**SQLite-specific and will not replay against Postgres** if this ever migrates — see
`docs/audit/postgres-migration.md` if that's relevant to your task. Name migrations for
*what changed* (`add_is_timeout_column_to_events`), matching existing style.

When adding a relation, choose the referential action deliberately, following existing
precedent: `RESTRICT` where deleting the parent should be blocked if dependents exist
(`Record → Event`/`Student` — this is what makes attendance history un-deletable by
accident), `SET NULL` for audit/informational relations that shouldn't cascade
(`Event/Record → User`), implicit `CASCADE` only on pure join tables.

## The seed script is fully destructive — treat it with respect

`prisma/seed.ts` deletes **every row in every table** (`record → event → student →
group → user`, in FK-safe order) before inserting fixed demo data. It's guarded to
refuse running when `NODE_ENV === "production"` unless `SEED_FORCE=true` is explicitly
set — **do not remove or weaken that guard**. If you need to seed a production-like
environment on purpose, use the `SEED_FORCE` escape hatch, don't loosen the check
itself.

`Group` rows (departments/programs/strands/houses/sections — the entire vocabulary a
student or event can be scoped by) are created **only** by this seed script; there is
no API route or UI to add one afterward. This is `DATA-02`, a confirmed P0 finding —
a real-world roster whose sections don't match the seeded vocabulary gets **entirely
rejected** on bulk import with no in-app recovery path. If your task involves group
vocabulary, read `docs/audit/data-integrity.md#data-02` and
`globals/constants/groups.ts` (the single source of truth the seed derives from) before
assuming you can "just add a group" some other way.

## Query patterns to follow

- `include`/`select` inline at the call site — there is no repository/DAO layer.
  `select` a relation down to only the fields actually rendered (e.g. `createdBy: {
  select: { name: true } }`, never the full `User` row, which carries the password
  hash).
- Reusable filters are plain exported functions returning a `Prisma.XWhereInput`
  (`buildEventStudentFilter`, `buildStudentQuery`) — not classes, not a query-builder
  abstraction. `buildEventStudentFilter` in particular is the single source of truth
  for "who is eligible for this event"; if you change it, check every one of its
  current call sites (**7**, across 5 files) including the print page, which
  calls it directly rather than through the stats API.
- Validate with Zod **before** any Prisma call, never after.

## Adding a new model

Follow `Group` as the precedent (the newest, most instructive addition). Full 8-step
checklist is in `docs/conventions.md`'s "How do I add a new database model?" section —
don't skip the index/uniqueness planning step (every existing model has at least one
deliberate `@@index` with a comment explaining the query it serves).
