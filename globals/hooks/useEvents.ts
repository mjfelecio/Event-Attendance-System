import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Event, NewEvent } from "@/globals/types/events";

type EventAPI = Omit<Event, "start" | "end" | "created_at" | "updated_at"> & {
  start: string; // NOTE: server always returns ISO strings
  end: string; // SO we have to parse them into Date objects in this file
  created_at: string;
  updated_at: string;
}

export const fetchEvents = async (): Promise<Event[]> => {
  const res = await fetch("/api/events");
  if (!res.ok) throw new Error("Failed to fetch events");

  const data: EventAPI[] = await res.json();

  // We should transform dates before passing them to the client
  return data.map((e) => ({
    ...e,
    start: new Date(e.start),
    end: new Date(e.end),
    created_at: new Date(e.start),
    updated_at: new Date(e.end),
  }));
};

const addEvent = async (event: NewEvent) => {
  const res = await fetch("/api/events", {
    method: "POST",
    body: JSON.stringify(event),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to add event");
  return res.json();
};

export const useAddEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });
};

export default useEvents;
