import { Student as PrismaStudent, SchoolLevel } from "@prisma/client";

export type Student = PrismaStudent;

// Prisma fields are camelCase; the old snake_case omit silently kept
// createdAt/updatedAt on NewStudent.
export type NewStudent = Omit<Student, "id" | "createdAt" | "updatedAt">;

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
  /** "present" when the eligible student has a record, "absent" otherwise. */
  status: "present" | "absent";
};

export type StudentAPI = Omit<Student, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
