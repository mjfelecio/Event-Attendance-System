import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventCategory } from "@prisma/client";
import { eventSchema } from "@/globals/schemas";
import { Event, EventForm } from "@/globals/types/events";

const getDefaultValues = (initialData?: Partial<Event>): EventForm => {
  const start = new Date();
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  return {
    title: "",
    location: null,
    category: EventCategory.ALL,
    start,
    end,
    description: null,
    allDay: false,
    ...initialData,
    // Contains only group id strings
    includedGroups: initialData?.includedGroups?.map((g) => g.id) ?? [],
  };
};

export function useEventForm(initialData?: Partial<Event>) {
  const form = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: getDefaultValues(initialData),
  });

  useEffect(() => {
    if (initialData) {
      form.reset(getDefaultValues(initialData));
    }
  }, [initialData, form]);

  return {
    ...form,
    handleSubmit: form.handleSubmit,
    resetForm: (values?: Partial<Event>) =>
      form.reset(getDefaultValues(values ?? initialData)),
  };
}
