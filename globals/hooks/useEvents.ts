import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Event, NewEvent } from "@/globals/types/events";

type EventAPI = Omit<Event, "start" | "end" | "created_at" | "updated_at"> & {
  start: string;
  end: string;
  created_at: string;
  updated_at: string;
};

// Transform function to make sure that the dates are actually a Date object
const transformEvent = (e: EventAPI): Event => ({
  ...e,
  start: new Date(e.start),
  end: new Date(e.end),
  created_at: new Date(e.created_at),
  updated_at: new Date(e.updated_at),
});

// Fetch
export const fetchEvents = async (): Promise<Event[]> => {
  const res = await fetch("/api/events");
  if (!res.ok) throw new Error("Failed to fetch events");

  const data: EventAPI[] = await res.json();
  return data.map(transformEvent);
};

// Upsert (add or edit)
const saveEvent = async (event: Event | NewEvent) => {
  const res = await fetch("/api/events", {
    method: "POST",
    body: JSON.stringify(event),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to save event");
  return res.json();
};

// Delete
const deleteEvent = async (id: string) => {
  const res = await fetch("/api/events", {
    method: "DELETE",
    body: JSON.stringify({ id }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to delete event");
  return res.json();
};

export const useSaveEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
};

const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });
};

export default useEvents;
