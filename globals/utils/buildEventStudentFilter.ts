import { SchoolLevel, StudentStatus } from "@prisma/client";
import { Event } from "@/globals/types/events";

 
// ============================================================================
// UTILITY: Build student filter based on event criteria
// ============================================================================
export const buildEventStudentFilter = (event: Event): Record<string, any> => {
  const where: Record<string, any> = {
    status: StudentStatus.ACTIVE,
  };

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
      const departments = JSON.parse(event.includedGroups || "[]");
      where.departmentSlug = { in: departments };
      break;

    case "STRAND":
      const strands = JSON.parse(event.includedGroups || "[]");
      where.shsStrand = { in: strands };
      break;

    case "HOUSE":
      const houses = JSON.parse(event.includedGroups || "[]");
      where.houseSlug = { in: houses };
      break;

    default:
      break;
  }

  return where;
};