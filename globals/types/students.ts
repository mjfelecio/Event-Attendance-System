import { Student as PrismaStudent  } from "@prisma/client";

export type Student = PrismaStudent;

export type NewStudent = Omit<Student, "id" | "created_at" | "updated_at">
