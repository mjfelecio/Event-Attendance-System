"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Event, NewEvent } from "@/globals/types/events";

export const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  location: z.string().nullable(),
  category: z.string().min(1, "Category is required"),
  start: z.date(),
  end: z.date(),
  description: z.string().nullable(),
  allDay: z.boolean(),
});

export type EventForm = z.infer<typeof eventSchema>;

const defaultValues: EventForm = {
  title: "",
  location: null,
  category: "",
  start: new Date(),
  end: new Date(),
  description: null,
  allDay: false,
};

export function useEventForm(
  onSuccess?: (data: Event | NewEvent) => void,
  initialData?: Partial<EventForm>
) {
  const form = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      ...defaultValues,
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset(defaultValues);
    }
  }, [initialData]);

  const handleSubmit = form.handleSubmit((data) => {
    if (onSuccess) {
      onSuccess({
        id: data.id,
        title: data.title,
        location: data.location,
        category: data.category,
        description: data.description,
        start: data.start,
        end: data.end,
        allDay: data.allDay,
      });
    }
    form.reset(initialData);
  });

  const resetForm = (values?: Partial<EventForm>) => {
    form.reset(values ?? initialData);
  };

  return {
    ...form,
    handleSubmit,
    resetForm,
  };
}
