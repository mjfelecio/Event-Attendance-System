import { SchoolLevel, StudentStatus, YearLevel } from "@prisma/client";
import { Event } from "@/globals/types/events";
import { Student } from "../types/students";

/** Safely parses the event's includedGroups JSON; malformed data yields []. */
const parseIncludedGroups = (includedGroups: string | null): string[] => {
  if (!includedGroups) return [];
  try {
    const parsed = JSON.parse(includedGroups);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/** Group types that can be excluded from an event (cross-level exclusion). */
export type ExcludedGroupType =
  | "DEPARTMENT"
  | "HOUSE"
  | "PROGRAM"
  | "STRAND"
  | "SECTION"
  | "YEAR";

export type ExcludedGroupEntry = { type: ExcludedGroupType; value: string };

/** Maps an exclusion type to the Student column it matches against. */
const EXCLUSION_FIELDS: Record<ExcludedGroupType, keyof Student> = {
  DEPARTMENT: "departmentSlug",
  HOUSE: "houseSlug",
  PROGRAM: "collegeProgram",
  STRAND: "shsStrand",
  SECTION: "section",
  YEAR: "yearLevel",
};

/** Fields that can be null on a Student row (need null-safe SQL exclusion). */
const NULLABLE_EXCLUSION_FIELDS = new Set<keyof Student>([
  "departmentSlug",
  "houseSlug",
  "collegeProgram",
  "shsStrand",
]);

/**
 * Safely parses the event's excludedGroups JSON into typed entries;
 * malformed data or unknown types/values are dropped.
 */
export const parseExcludedGroups = (
  excludedGroups: string | null | undefined
): ExcludedGroupEntry[] => {
  if (!excludedGroups) return [];
  try {
    const parsed = JSON.parse(excludedGroups);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is ExcludedGroupEntry =>
        !!entry &&
        typeof entry === "object" &&
        typeof entry.value === "string" &&
        entry.value.length > 0 &&
        entry.type in EXCLUSION_FIELDS &&
        // YEAR exclusions must be valid YearLevel enum members or Prisma errors
        (entry.type !== "YEAR" || entry.value in YearLevel)
    );
  } catch {
    return [];
  }
};

// ============================================================================
// UTILITY: Build student filter based on event criteria
// ============================================================================
// This builds a dynamic Prisma where-fragment with heterogeneous shapes
// (scalars, { in: [...] }, OR/AND arrays); `any` is intentional here so it
// stays assignable to Prisma's generated where types at every call site.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildEventStudentFilter = (event: Event): Record<string, any> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {
    status: StudentStatus.ACTIVE,
  };

  const includedGroups = parseIncludedGroups(event.includedGroups);

  switch (event.category) {
    case "ALL":
      break;

    case "COLLEGE":
      where.schoolLevel = SchoolLevel.COLLEGE;
      break;

    case "SHS":
      where.schoolLevel = SchoolLevel.SHS;
      break;

    case "DEPARTMENT":
      where.departmentSlug = { in: includedGroups };
      break;

    case "STRAND":
      where.shsStrand = { in: includedGroups };
      break;

    case "HOUSE":
      where.houseSlug = { in: includedGroups };
      break;

    case "PROGRAM":
      where.collegeProgram = { in: includedGroups };
      break;

    case "SECTION":
      where.section = { in: includedGroups };
      break;

    case "YEAR":
      where.yearLevel = { in: includedGroups };
      break;

    default:
      break;
  }

  // Cross-level exclusions: remove specific narrower groups from the audience.
  const exclusions = parseExcludedGroups(event.excludedGroups);
  if (exclusions.length > 0) {
    const valuesByField = new Map<keyof Student, string[]>();
    for (const entry of exclusions) {
      const field = EXCLUSION_FIELDS[entry.type];
      valuesByField.set(field, [...(valuesByField.get(field) ?? []), entry.value]);
    }

    where.AND = [...valuesByField.entries()].map(([field, values]) =>
      // SQL: `col NOT IN (...)` is NULL (row dropped) when col is NULL, so
      // nullable columns need an explicit null escape hatch.
      NULLABLE_EXCLUSION_FIELDS.has(field)
        ? { OR: [{ [field]: null }, { [field]: { notIn: values } }] }
        : { [field]: { notIn: values } }
    );
  }

  return where;
};

/**
 * Checks if a specific student is eligible to join an event
 * based on the event's category and included groups.
 *
 * Must mirror buildEventStudentFilter exactly (SQL vs in-memory).
 */
export const isStudentInEvent = (student: Student, event: Event): boolean => {
  // Ensure student is active first
  if (student.status !== StudentStatus.ACTIVE) return false;

  // Excluded students are never eligible, regardless of category
  for (const entry of parseExcludedGroups(event.excludedGroups)) {
    const value = student[EXCLUSION_FIELDS[entry.type]];
    if (value != null && value === entry.value) return false;
  }

  const includedGroups: string[] = parseIncludedGroups(event.includedGroups);

  switch (event.category) {
    case "ALL":
      return true;

    case "COLLEGE":
      return student.schoolLevel === SchoolLevel.COLLEGE;

    case "SHS":
      return student.schoolLevel === SchoolLevel.SHS;

    case "DEPARTMENT":
      return !!student.departmentSlug && includedGroups.includes(student.departmentSlug);

    case "STRAND":
      return !!student.shsStrand && includedGroups.includes(student.shsStrand);

    case "HOUSE":
      return !!student.houseSlug && includedGroups.includes(student.houseSlug);

    case "PROGRAM":
      return !!student.collegeProgram && includedGroups.includes(student.collegeProgram);

    case "SECTION":
      return !!student.section && includedGroups.includes(student.section);

    case "YEAR":
      return !!student.yearLevel && includedGroups.includes(student.yearLevel);

    default:
      return false;
  }
};
