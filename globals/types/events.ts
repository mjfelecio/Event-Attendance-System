import { Event as PrismaEvent } from "@prisma/client";

// organizerName is an optional, denormalized display field the single-event
// endpoint adds (the organizer's name) so the UI needn't show a raw user id.
export type Event = PrismaEvent & { organizerName?: string | null };

export type NewEvent = Omit<
  PrismaEvent,
  "id" | "createdAt" | "updatedAt"
>;

export type EventStats = {
  eligible: number;
  present: number;
  absent: number;
};

export type EventAPI = Omit<
  Event,
  "start" | "end" | "createdAt" | "updatedAt"
> & {
  start: string;
  end: string;
  createdAt: string;
  updatedAt: string;
};
