import { Student as PrismaStudent, SchoolLevel  } from "@prisma/client";

export type Student = PrismaStudent;

export type NewStudent = Omit<Student, "id" | "created_at" | "updated_at">

export type StudentAttendanceRecord = {
	id: string;
	eventId: string,
	studentId: string,
	fullName: string,
	schoolLevel: SchoolLevel,
	section: string,
	timestamp: string; // Date UTC timestamp
} 