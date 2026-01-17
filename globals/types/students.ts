import {
  AttendanceStatus,
  Student as PrismaStudent,
  SchoolLevel,
} from "@prisma/client";

export type Student = PrismaStudent;

export type NewStudent = Omit<Student, "id" | "created_at" | "updated_at">;

/**
 * A record with its corresponding student data attached
 */
export type StudentAttendanceRecord = {
  id: string;
  eventId: string;
  studentId: string;
  status: AttendanceStatus;
  fullName: string;
  schoolLevel: SchoolLevel;
  section: string;
  timein: string; // Date UTC timestamp
  timeout: string; // Date UTC timestamp
};

export type StudentAPI = Omit<Student, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
