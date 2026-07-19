import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/globals/utils/queryKeys";
import { fetchApi } from "@/globals/utils/api";
import { Event } from "@/globals/types/events";

/** Toggles the event's timeout mode; resolves with the updated event. */
const useToggleTimeoutMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => {
      return fetchApi<Event>(`/api/events/${eventId}/timeout`, {
        method: "POST",
      });
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.withId(eventId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all() });
    },
  });
};

export default useToggleTimeoutMode;
