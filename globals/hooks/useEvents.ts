import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Event, EventStats, NewEvent } from "@/globals/types/events";

type EventAPI = Omit<Event, "start" | "end" | "createdAt" | "updatedAt"> & {
  start: string;
  end: string;
  createdAt: string;
  updatedAt: string;
};

// Transform function to make sure that the dates are actually a Date object
const transformEvent = (e: EventAPI): Event => ({
  ...e,
  start: new Date(e.start),
  end: new Date(e.end),
  createdAt: new Date(e.createdAt),
  updatedAt: new Date(e.updatedAt),
});

// Fetch
export const fetchEvents = async (): Promise<Event[]> => {
  const res = await fetch("/api/events");
  if (!res.ok) throw new Error("Failed to fetch events");

  const data: EventAPI[] = await res.json();
  return data.map(transformEvent);
};

// Fetch stats of an event
export const fetchEventStats = async (eventId: string): Promise<EventStats> => {
  const res = await fetch(`/api/events/${eventId}/stats`);
  const { success, data } = await res.json();

  if (!success) throw new Error("Failed to fetch events");

  return data;
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

// Fetches event stats
export const useEventStats = (eventId?: string) => {
  return useQuery({
    queryKey: ["events", eventId, "stats"],
    enabled: !!eventId,
    queryFn: () => fetchEventStats(eventId!),
  });
};

const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });
};

export default useEvents;
