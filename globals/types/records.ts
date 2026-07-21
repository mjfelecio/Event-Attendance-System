import { Record as PrismaRecord  } from "@prisma/client";

export type Record = PrismaRecord;

// Audit actor columns are stamped by the server, never sent by the client
export type NewRecord = Omit<
  Record,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "timein"
  | "timeout"
  | "recordedById"
  | "lastModifiedById"
>

export type AttendanceStatus = "absent" | "present";