"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewEvent } from "@/globals/types/events";

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  start: z.date(),
  end: z.date(),
  description: z.string().optional(),
  allDay: z.boolean(),
});

export type EventForm = z.infer<typeof eventSchema>;

export function useEventForm(onSuccess?: (data: NewEvent) => void) {
  const form = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      location: "",
      category: "",
      start: new Date(),
      end: new Date(),
      description: "",
      allDay: false,
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (onSuccess) onSuccess({
      title: data.title,
      location: data.location ?? null,
      category: data.category,
      description: data.description ?? null,
      start: data.start,
      end: data.end,
    });
    form.reset();
  });

  const resetForm = () => {
    form.reset();
  };

  return {
    ...form,
    handleSubmit,
    resetForm,
  };
}
