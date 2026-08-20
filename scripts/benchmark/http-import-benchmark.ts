/**
 * End-to-end benchmark for the student bulk import, driving the real API the
 * same way the UI does: login, POST the parsed roster to
 * /api/bulk-import/students, then inspect the database to verify the outcome.
 *
 * Requires the app to already be running (production build recommended) against
 * the same database this script inspects:
 *   DATABASE_URL="file:./prisma/benchmark.db" pnpm start
 *
 * Usage (from repo root):
 *   DB_PATH=prisma/benchmark.db \
 *   npx tsx scripts/benchmark/http-import-benchmark.ts [fresh|rerun|invalid|all]
 *
 * Scenarios:
 *   fresh   POST the full 2,000-student roster to an empty Student table.
 *   rerun   POST the same roster again — must not create duplicates.
 *   invalid POST the roster with one bad group slug — must reject the whole
 *           batch (all-or-nothing) and change nothing.
 *   all     fresh, then rerun, then invalid (default).
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import Database from "better-sqlite3";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const DB_PATH = process.env.DB_PATH ?? "prisma/benchmark.db";
const EMAIL = process.env.ADMIN_EMAIL ?? "admin@gmail.com";
const PASSWORD = process.env.ADMIN_PASSWORD ?? "password";

const roster = JSON.parse(
  readFileSync(join(process.cwd(), "scripts/benchmark/roster-2000.json"), "utf8"),
);

const scenario = process.argv[2] ?? "all";

if (!existsSync(DB_PATH)) {
  console.error(`Database not found at ${DB_PATH}`);
  process.exit(1);
}
const db = new Database(DB_PATH, { readonly: true });

const dbSnapshot = () => {
  const students = db
    .prepare("SELECT COUNT(*) AS n FROM Student")
    .get() as { n: number };
  const uniqueIds = db
    .prepare("SELECT COUNT(DISTINCT id) AS n FROM Student")
    .get() as { n: number };
  const joins = db
    .prepare('SELECT COUNT(*) AS n FROM "_GroupToStudent"')
    .get() as { n: number };
  const badJoins = db
    .prepare(
      `SELECT COUNT(*) AS n FROM "_GroupToStudent" j
       LEFT JOIN Student s ON s.id = j.B
       LEFT JOIN "Group" g ON g.id = j.A
       WHERE s.id IS NULL OR g.id IS NULL`,
    )
    .get() as { n: number };
  return {
    students: students.n,
    uniqueIds: uniqueIds.n,
    joins: joins.n,
    badJoins: badJoins.n,
  };
};

async function login() {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const body = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(`Login failed (${res.status}): ${JSON.stringify(body)}`);
  }
  const setCookie = res.headers.getSetCookie().find((c) => c.startsWith("event-attendance-auth"));
  if (!setCookie) throw new Error("No session cookie returned by login");
  return setCookie.split(";")[0];
}

async function postRoster(cookie: string, payload: unknown) {
  const t0 = performance.now();
  const res = await fetch(`${BASE_URL}/api/bulk-import/students`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify(payload),
  });
  const elapsedMs = performance.now() - t0;
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    /* non-JSON response */
  }
  return { status: res.status, elapsedMs, body };
}

async function run(label: string, cookie: string, payload: unknown) {
  const before = dbSnapshot();
  const { status, elapsedMs, body } = await postRoster(cookie, payload);
  const after = dbSnapshot();
  console.log(`--- ${label} ---`);
  console.log(`  HTTP ${status} in ${(elapsedMs / 1000).toFixed(2)}s`);
  console.log(`  response: ${JSON.stringify(body)}`);
  console.log(
    `  students: ${before.students} -> ${after.students} (unique ids ${after.uniqueIds}, joins ${after.joins}, orphan joins ${after.badJoins})`,
  );
  return { status, elapsedMs, before, after };
}

async function main() {
  const cookie = await login();
  console.log(`Logged in as ${EMAIL} against ${BASE_URL} (db: ${DB_PATH})`);

  const before = dbSnapshot();
  console.log(`Baseline: ${JSON.stringify(before)}\n`);

  if (scenario === "fresh" || scenario === "all") {
    await run("FRESH 2,000-row import", cookie, roster);
    console.log();
  }
  if (scenario === "rerun" || scenario === "all") {
    await run("RE-RUN same roster (idempotency)", cookie, roster);
    console.log();
  }
  if (scenario === "invalid" || scenario === "all") {
    const payload = JSON.parse(JSON.stringify(roster));
    payload[500].section = "section-that-does-not-exist";
    await run("INVALID row (one unknown section slug)", cookie, payload);
    console.log();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.close());