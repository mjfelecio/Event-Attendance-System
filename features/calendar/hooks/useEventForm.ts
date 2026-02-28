"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Event, NewEvent } from "@/globals/types/events";
import { EventCategory } from "@prisma/client";

/**
 * Zod schema for event form validation
 * Validates event properties and ensures business logic constraints
 */
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
  // Validate that end date is after start date
  .refine(
    (data) => {
      if (data.allDay) {
        // For all-day events, compare only the date portion (ignore time)
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

      // For timed events, allow same start/end to avoid false blocking on untouched forms.
      return data.end >= data.start;
    },
    {
      message: "End date must be the same or after start date",
      path: ["end"],
    }
  )
  // Validate that includedGroups is provided when needed
  .refine(
    (data) => {
      const { category, includedGroups } = data;

      // Categories that apply to everyone don't require group selection
      const categoriesWithoutGroups = ["ALL", "COLLEGE", "SHS"];
      const needsGroupSelection = !categoriesWithoutGroups.includes(category);

      // If this category doesn't need groups, validation passes
      if (!needsGroupSelection) return true;

      // Otherwise, at least one group must be selected
      return includedGroups && includedGroups.length > 0;
    },
    {
      message: "At least 1 group must be selected",
      path: ["includedGroups"],
    }
  );

/** Inferred type from eventSchema for type-safe form usage */
export type EventForm = z.infer<typeof eventSchema>;

const normalizeAllDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const formatEventPayload = (data: EventForm): Event | NewEvent => {
  const start = data.allDay ? normalizeAllDay(data.start) : data.start;
  const end = data.allDay ? normalizeAllDay(data.end) : data.end;

  return {
    id: data.id,
    title: data.title,
    location: data.location,
    category: data.category,
    includedGroups: data.includedGroups
      ? JSON.stringify(data.includedGroups)
      : null,
    description: data.description,
    start,
    end,
    allDay: data.allDay,
  } as Event | NewEvent;
};

/** Default form values for new events */
const getDefaultValues = (): EventForm => {
  const start = new Date();
  const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour

  return {
    title: "",
    location: null,
    category: EventCategory.ALL,
    includedGroups: [],
    start,
    end,
    description: null,
    allDay: false,
  };
};

const buildFormValues = (initialData?: Partial<EventForm>): EventForm => ({
  ...getDefaultValues(),
  ...initialData,
});

/**
 * Hook for managing event creation and editing forms
 *
 * @param onSuccess - Callback fired when form is successfully submitted
 * @param initialData - Initial values for edit mode; undefined for create mode
 * @returns Form methods (control, watch, etc.) and custom handlers
 *
 * @example
 * const { control, handleSubmit, resetForm } = useEventForm(
 *   (data) => saveEvent(data),
 *   existingEvent
 * );
 */
export function useEventForm(
  onSuccess?: (data: Event | NewEvent) => void,
  initialData?: Partial<EventForm>
) {
  // Initialize form with React Hook Form and Zod validation
  const form = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: buildFormValues(initialData),
  });

  // Reset form when initialData changes (switching between create/edit modes)
  useEffect(() => {
    form.reset(buildFormValues(initialData));
  }, [initialData, form]);

  /**
   * Handles form submission
   * - Normalizes all-day event times (removes time component)
   * - Serializes includedGroups to JSON
   * - Triggers onSuccess callback
   * - Resets form to initial state
   */
  const handleSubmit = form.handleSubmit((data) => {
    // Execute callback with properly formatted data
    if (onSuccess) {
      onSuccess(formatEventPayload(data));
    }

    // Reset form after successful submission
    form.reset(buildFormValues(initialData));
  });

  /**
   * Manually reset form to initial or provided values
   * Useful for cancel buttons and cleanup
   *
   * @param values - Optional custom values to reset to; defaults to initialData
   */
  const resetForm = (values?: Partial<EventForm>) => {
    form.reset(buildFormValues(values ?? initialData));
  };

  return {
    ...form,
    handleSubmit,
    handleSubmitRaw: form.handleSubmit,
    resetForm,
  };
}
