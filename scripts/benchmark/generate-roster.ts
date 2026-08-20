/**
 * Benchmark/test roster generator.
 *
 * Deterministically produces a realistic ~2,000-student roster that can be fed
 * to the student bulk importer (either through the UI CSV dropzone or directly
 * to POST /api/bulk-import/students). Used to verify issue #38: bulk import
 * must handle a full school roster (2,000+ students) reliably.
 *
 * Output (both written next to this file):
 *   - roster-2000.csv   the CSV as an operator would upload
 *   - roster-2000.json  the header-keyed JSON payload the importer sends after
 *                       parsing the CSV (matching react-papaparse `header:true`)
 *
 * The generator only references group slugs from the seeded vocabulary, so the
 * output works against any freshly-seeded database (`pnpm db:seed`) with no
 * extra setup. Re-running it is idempotent (fixed seed), so the committed files
 * can be regenerated to prove the check-in matches the generator.
 */
import { faker } from "@faker-js/faker";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROSTER_SIZE = 2000;
const SEED = 20260820;
const ID_BASE = 20260000000; // 11-digit student ID, matching the seed's scheme

// Seeded group vocabulary (globals/constants/groups.ts + prisma/seed.ts). Slugs
// are the values the importer matches, not the display names.
const SECTIONS = ["bscs-2a", "bsit-2b", "stem-11a", "stem-12b"];
const HOUSES = ["giallio", "roxxo", "azul", "cahel", "vierrdy"];
const STRANDS = ["stem", "abm", "assh", "css", "he", "programming", "animation"];
const PROGRAM_DEPARTMENT: Record<string, string> = {
  bscs: "computer-studies",
  bsit: "computer-studies",
  bshm: "hotel-management",
  bsba: "business-administration",
};
const PROGRAMS = Object.keys(PROGRAM_DEPARTMENT);

faker.seed(SEED);

const pick = <T>(arr: readonly T[]): T => faker.helpers.arrayElement(arr);
const chance = (p: number): boolean =>
  faker.number.float({ min: 0, max: 1, fractionDigits: 6 }) < p;

type RosterRow = {
  id: string;
  lastName: string;
  firstName: string;
  middleName: string;
  schoolLevel: string;
  yearLevel: string;
  section: string;
  house: string;
  program: string;
  department: string;
  strand: string;
};

const rows: RosterRow[] = [];

for (let i = 0; i < ROSTER_SIZE; i++) {
  const college = chance(0.55);
  const program = college ? pick(PROGRAMS) : "";
  rows.push({
    id: String(ID_BASE + i),
    lastName: faker.person.lastName(),
    firstName: faker.person.firstName(),
    middleName: chance(0.7) ? faker.person.middleName() : "",
    schoolLevel: college ? "COLLEGE" : "SHS",
    yearLevel: college
      ? pick(["YEAR_1", "YEAR_2", "YEAR_3", "YEAR_4"])
      : pick(["GRADE_11", "GRADE_12"]),
    section: pick(SECTIONS),
    house: pick(HOUSES),
    program,
    department: college ? PROGRAM_DEPARTMENT[program] : "",
    strand: college ? "" : pick(STRANDS),
  });
}

// Column order matches public/templates/student_import_template.csv.
const HEADER = [
  "id",
  "lastName",
  "firstName",
  "middleName",
  "schoolLevel",
  "yearLevel",
  "section",
  "house",
  "program",
  "department",
  "strand",
] as const;

const escapeCell = (value: string): string =>
  /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

const toCsv = (): string =>
  [HEADER.join(","), ...rows.map((r) => HEADER.map((h) => escapeCell(r[h])).join(","))].join(
    "\n",
  );

const outDir = dirname(fileURLToPath(import.meta.url));
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "roster-2000.csv"), toCsv() + "\n");
writeFileSync(join(outDir, "roster-2000.json"), JSON.stringify(rows) + "\n");

console.log(
  `Wrote ${rows.length} rows to roster-2000.csv / roster-2000.json (seed ${SEED}).`,
);