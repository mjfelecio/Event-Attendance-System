"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Event, NewEvent } from "@/globals/types/events";
import { EventCategory } from "@prisma/client";

export const eventSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    location: z.string().nullable(),
    category: z.enum(EventCategory),
    includedGroups: z.array(z.string()).nullable(),
    start: z.date(),
    end: z.date(),
    description: z.string().nullable(),
    allDay: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.allDay) {
        // Compare only yyyy-mm-dd portion
        const startDay = new Date(
          data.start.getFullYear(),
          data.start.getMonth(),
          data.start.getDate()
        );
        const endDay = new Date(
          data.end.getFullYear(),
          data.end.getMonth(),
          data.end.getDate()
        );
        return endDay >= startDay;
      }

      return data.end > data.start;
    },
    {
      message: "End date must be after start date",
      path: ["end"],
    }
  )
  .refine(
    (data) => {
      const { category, includedGroups } = data;

      // These categories dont need to pick any groups
      // All = ALL Students included
      // College = All College included
      // SHS = All SHS included
      const needToPickGroups = !(
        category === "ALL" ||
        category === "COLLEGE" ||
        category === "SHS"
      );

      // If we don't need to pick groups, just return early
      if (!needToPickGroups) return;

      // Otherwise, includedGroups must have atleast one item
      return includedGroups?.length !== 0;
    },
    {
      message: "Atleast 1 group must be selected",
      path: ["includedGroups"],
    }
  );

export type EventForm = z.infer<typeof eventSchema>;

const defaultValues: EventForm = {
  title: "",
  location: null,
  category: EventCategory.ALL,
  includedGroups: [],
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
    if (data.allDay) {
      // Drop time info if allDay
      const startDay = new Date(
        data.start.getFullYear(),
        data.start.getMonth(),
        data.start.getDate()
      );
      const endDay = new Date(
        data.end.getFullYear(),
        data.end.getMonth(),
        data.end.getDate()
      );

      data.start = startDay;
      data.end = endDay;
    }

    if (onSuccess) {
      onSuccess({
        id: data.id,
        title: data.title,
        location: data.location,
        category: data.category,
        includedGroups: data.includedGroups
          ? JSON.stringify(data.includedGroups)
          : null,
        description: data.description,
        start: data.start,
        end: data.end,
        allDay: data.allDay,
      } as Event | NewEvent);
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
