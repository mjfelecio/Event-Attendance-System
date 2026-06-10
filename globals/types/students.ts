import { Group, Prisma, Student as PrismaStudent, SchoolLevel } from "@prisma/client";

// Extends student type with flatted groups
export type Student = PrismaStudent & {
  house?: string;
  section?: string;
  department?: string;
  program?: string;
  strand?: string;
  groups?: Group[]
};

export type StudentDTO = Omit<Student, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

/**
 * A record with its corresponding student data attached
 */
export type StudentAttendanceRecord = {
  id: string;
  eventId: string;
  studentId: string;
  fullName: string;
  schoolLevel: SchoolLevel;
  section: Group | null;
  timein: string | null; // Date UTC timestamp
  timeout: string | null; // Date UTC timestamp
};

export type StudentWithRecords = Prisma.StudentGetPayload<{
  include: {
    records: true;
    groups: true;
  };
}>;
