import { Event as PrismaEvent } from "@prisma/client";
import { eventSchema } from "@/globals/schemas";
import z from "zod";

export type Event = PrismaEvent;

export type NewEvent = Omit<Event, "id" | "createdAt" | "updatedAt">;

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
