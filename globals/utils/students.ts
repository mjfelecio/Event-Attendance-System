import { Group, Student as PrismaStudent } from "@prisma/client";
import { Student } from "../types/students";

/**
 * Maps the groups the student belongs to into a field
 * in the student, allowing for easy access down the road
 *
 * @param student
 * @returns {Student}
 */
export function flattenStudentGroups(
  student: PrismaStudent & { groups: Group[] },
): Student {
  const flattenedGroups = student.groups.reduce(
    (acc, group) => {
      const key = group.category.toLowerCase();
      acc[key] = group.slug;
      return acc;
    },
    {} as Record<string, string>,
  );

  return {
    ...student,
    ...flattenedGroups,
  };
}
