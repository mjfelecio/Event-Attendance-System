import { SchoolLevel, StudentStatus } from "@prisma/client";
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

// ============================================================================
// UTILITY: Build student filter based on event criteria
// ============================================================================
export const buildEventStudentFilter = (event: Event): Record<string, any> => {
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

  return where;
};

/**
 * Checks if a specific student is eligible to join an event 
 * based on the event's category and included groups.
 */
export const isStudentInEvent = (student: Student, event: Event): boolean => {
  // Ensure student is active first
  if (student.status !== StudentStatus.ACTIVE) return false;

  const includedGroups: string[] = JSON.parse(event.includedGroups || "[]");

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