import { Record as PrismaRecord  } from "@prisma/client";

export type Record = PrismaRecord;

export type NewRecord = Omit<Record, "id" | "created_at" | "updated_at">
