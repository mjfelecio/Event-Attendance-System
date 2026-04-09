import { Group, Prisma, SchoolLevel } from "@prisma/client";
import { Event } from "@/globals/types/events";
import { Student } from "../types/students";

// ============================================================================
// UTILITY: Build student filter based on event criteria
// ============================================================================
export const buildEventStudentFilter = (
  event: Event & { includedGroups: Group[] },
): Prisma.StudentWhereInput => {
  const where: Prisma.StudentWhereInput = {};

  // Categories that map to enums remain the same
  if (event.category === "COLLEGE") where.schoolLevel = SchoolLevel.COLLEGE;
  if (event.category === "SHS") where.schoolLevel = SchoolLevel.SHS;
  if (event.category === "ALL") return where;

  // For everything else, we query the 'groups' relation by slug
  const includedSlugs: string[] = event.includedGroups.map((g) => g.slug);

  if (includedSlugs.length > 0) {
    where.groups = {
      some: {
        slug: { in: includedSlugs },
      },
    };
  }

  return where;
};

/**
 * Checks if a specific student is eligible to join an event
 * based on the event's category and included groups.
 */
export const isStudentInEvent = (
  student: Student,
  event: Event & { includedGroups: Group[] },
): boolean => {
  const category = event.category;
  if (category === "ALL") return true;
  if (category === "COLLEGE") return student.schoolLevel === "COLLEGE";
  if (category === "SHS") return student.schoolLevel === "SHS";

  const includedSlugs: string[] = event.includedGroups.map((g) => g.slug);

  // Dynamically check the flattened property matching the category
  // e.g., if category is "HOUSE", it checks student["house"]
  const studentGroupSlug = student[category.toLowerCase() as keyof Student];

  return (
    typeof studentGroupSlug === "string" &&
    includedSlugs.includes(studentGroupSlug)
  );
};
