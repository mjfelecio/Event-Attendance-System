import { Group, Prisma, Event as PrismaEvent } from "@prisma/client";
import { eventSchema } from "@/globals/schemas";
import z from "zod";

// organizerName is an optional, denormalized display field the single-event
// endpoint adds (the organizer's name) so the UI needn't show a raw user id.
export type Event = PrismaEvent & {
  includedGroups: Group[];
  organizerName?: string | null;
};

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

export type EventForm = z.infer<typeof eventSchema>;

export type EventWithGroupsAndCreator = Prisma.EventGetPayload<{
  include: {
    includedGroups: true;
    createdBy: true;
  };
}>;

