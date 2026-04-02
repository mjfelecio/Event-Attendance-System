import { Student as PrismaStudent, SchoolLevel } from "@prisma/client";

export type Student = PrismaStudent;

export type NewStudent = Omit<Student, "id" | "created_at" | "updated_at">;

/**
 * A record with its corresponding student data attached
 */
export type StudentAttendanceRecord = {
  id: string;
  eventId: string;
  studentId: string;
  fullName: string;
  schoolLevel: SchoolLevel;
  section: string;
  timein: string | null; // Date UTC timestamp
  timeout: string | null; // Date UTC timestamp
};

export type StudentAPI = Omit<Student, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

// BELOW IS TEMPORARY
type WithGroups = {
  house?: string;
  section?: string;
  department?: string;
  program?: string;
  strand?: string;
};

export type StudentWithGroups = Student & WithGroups;
export type StudentAPIWithGroups = Student & WithGroups;
