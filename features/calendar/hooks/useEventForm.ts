import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventCategory } from "@prisma/client";
import { eventSchema } from "@/globals/schemas";
import { EventForm } from "@/globals/types/events";

const getDefaultValues = (initialData?: Partial<EventForm>): EventForm => {
  const start = new Date();
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  return {
    title: "",
    location: null,
    category: EventCategory.ALL,
    includedGroups: [],
    start,
    end,
    description: null,
    allDay: false,
    ...initialData,
  };
};

export function useEventForm(
  initialData?: Partial<EventForm>,
) {
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
    resetForm: (values?: Partial<EventForm>) =>
      form.reset(getDefaultValues(values ?? initialData)),
  };
}
