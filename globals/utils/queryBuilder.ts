import { Group, Prisma, Student as PrismaStudent } from "@prisma/client";
import { Student } from "@/globals/types/students";

/**
 * Builds a Prisma 'where' object based on provided search filters.
 * Uses an 'AND' array so multiple filters (House + Strand) work together.
 */
export function buildStudentQuery(params: any): Prisma.StudentWhereInput {
  const { category, house, department, program, strand } = params;
  const conditions: Prisma.StudentWhereInput[] = [];

  // 1. Filter by House
  if (house) {
    conditions.push({
      groups: { some: { category: "HOUSE", slug: house } },
    });
  }

  // 2. Filter by College/Dept/Program
  if (category === "COLLEGE") {
    if (department) {
      conditions.push({
        groups: { some: { category: "DEPARTMENT", slug: department } },
      });
    }
    if (program) {
      conditions.push({
        groups: { some: { category: "PROGRAM", slug: program } },
      });
    }
  }

  // 3. Filter by SHS/Strand
  if (category === "SHS" && strand) {
    conditions.push({
      groups: { some: { category: "STRAND", slug: strand } },
    });
  }

  // If no conditions, return empty object (fetches all)
  if (conditions.length === 0) return {};

  // Combine all conditions using AND
  return { AND: conditions };
}