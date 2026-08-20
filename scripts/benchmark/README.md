# Bulk import benchmark & test fixtures

Fixtures and harnesses for verifying that the student bulk import handles a full
2,000+ student roster reliably (issue
[#38](https://github.com/mjfelecio/Event-Attendance-System/issues/38)).

## Files

- `generate-roster.ts` — deterministic generator (fixed seed) that writes a
  ~2,000-student roster. Values only use the seeded group slug vocabulary, so the
  output works against any freshly-seeded database.
- `roster-2000.csv` — the CSV an operator would upload (matches
  `public/templates/student_import_template.csv`).
- `roster-2000.json` — the header-keyed payload the importer sends after parsing
  the CSV (matches react-papaparse `header: true`).
- `direct-transaction.ts` — standalone probe that replicates the route's
  `prisma.$transaction([...upserts])` against a scratch SQLite file with query
  logging and a stopwatch. No HTTP, no Next.js.
- `http-import-benchmark.ts` — end-to-end harness: logs in, POSTs the roster to
  the real `/api/bulk-import/students`, then inspects the database to verify the
  outcome. Requires the app already running against the same database file.

## Regenerate the fixtures

```bash
pnpm benchmark:roster
```

Idempotent — re-running reproduces the committed files byte-for-byte.

## Direct probe (no server)

Point it at a scratch database that has the seeded group vocabulary (copy
`prisma/dev.db` and clear the students):

```bash
pnpm benchmark:probe   # reads DATABASE_URL
```

With `DATABASE_URL="file:./prisma/benchmark.db"`, it prints the transaction
duration, SQL statement count, and whether any timeout fired. It logs every
statement; pipe through `2>&1 | grep -v '^prisma:query'` for a summary only.

## End-to-end harness (server required)

```bash
# 1. Scratch DB (keeps groups + users from the seed, clears students)
cp prisma/dev.db prisma/benchmark.db
sqlite3 prisma/benchmark.db "PRAGMA foreign_keys=ON; DELETE FROM Record; DELETE FROM Event; DELETE FROM Student;"

# 2. Start the app against that DB (production build recommended)
DATABASE_URL="file:./prisma/benchmark.db" pnpm start

# 3. Run the harness
DB_PATH=prisma/benchmark.db pnpm benchmark:import [fresh|rerun|invalid|all]
```

`BASE_URL` (default `http://localhost:3000`) and `ADMIN_EMAIL`/`ADMIN_PASSWORD`
(default `admin@gmail.com` / `password`) are also configurable.

Scenarios:

- `fresh` — POST the full roster to an empty Student table.
- `rerun` — POST the same roster again; must not create duplicates.
- `invalid` — POST the roster with one bad group slug; the whole batch must be
  rejected and nothing changed.
- `all` — fresh, then rerun, then invalid (default).

`prisma/benchmark.db` is gitignored (`prisma/*.db`); it is a scratch file, never
the real `dev.db`.