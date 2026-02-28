import { Record as PrismaRecord  } from "@prisma/client";

export type Record = PrismaRecord;

export type NewRecord = Omit<Record, "id" | "createdAt" | "updatedAt" | "timein" | "timeout">

export type AttendanceStatus = "absent" | "present";