import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/globals/utils/queryKeys";
import { fetchApi } from "@/globals/utils/api";

const useStartTimeoutMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => {
      return fetchApi(`/api/events/${eventId}/timeout`, {
        method: "POST",
      });
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.withId(eventId),
      });
    },
  });
};

export default useStartTimeoutMode;
