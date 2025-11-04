import { Event as PrismaEvent } from "@prisma/client";

export type Event = PrismaEvent;

export type NewEvent = Omit<Event, "id" | "createdAt" | "updatedAt">;

export type EventStats = {
  eligible: number;
  present: number;
  unattended: number;
};
