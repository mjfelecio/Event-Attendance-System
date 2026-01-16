import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Event, EventAPI, EventStats, NewEvent } from "@/globals/types/events";
import { fetchApi } from "@/globals/utils/api";
import { queryKeys } from "@/globals/utils/queryKeys";

// Transform function to make sure that the dates are actually a Date object
const transformEvent = (e: EventAPI): Event => ({
  ...e,
  start: new Date(e.start),
  end: new Date(e.end),
  createdAt: new Date(e.createdAt),
  updatedAt: new Date(e.updatedAt),
});

/**
 * Creates or Edit an event
 *
 * @returns created or edited Event object
 */
export const useSaveEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (event: Event | NewEvent) => {
      return fetchApi("/api/events", {
        method: "POST",
        body: JSON.stringify(event),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all() }),
  });
};

/**
 * Deletes an event
 *
 * @returns deleted Event
 */
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      return fetchApi("/api/events", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all() }),
  });
};

/**
 * Fetches stats from the event
 *
 * @returns EventStats
 */
export const useStatsOfEvent = (eventId?: string) => {
  return useQuery({
    queryKey: queryKeys.events.statsFromEvent(eventId!),
    enabled: !!eventId,
    queryFn: () => {
      if (!eventId) return null;

      return fetchApi<EventStats>(`/api/events/${eventId}/stats`);
    },
  });
};

/**
 * Fetches all events
 */
const useEvents = () => {
  return useQuery({
    queryKey: queryKeys.events.all(),
    queryFn: async () => {
      const events = await fetchApi<EventAPI[]>("/api/events");
      return events.map(transformEvent);
    },
  });
};

/**
 * Fetches an event through its id
 */
export const useFetchEvent = (eventId?: string) => {
  return useQuery({
    queryKey: queryKeys.events.withId(eventId!),
    queryFn: async () => {
      const event = await fetchApi<EventAPI>(`/api/events/${eventId}`);
      return transformEvent(event);
    },
    enabled: !!eventId,
  });
};

export default useEvents;
