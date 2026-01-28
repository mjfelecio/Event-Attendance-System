import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchApi } from "@/globals/utils/api";
import { queryKeys } from "@/globals/utils/queryKeys";

export type PendingOrganizer = {
  id: string;
  name: string;
  email: string;
  status: "PENDING" | "ACTIVE" | "REJECTED";
  rejectionReason: string | null;
  createdAt: string;
};

export const usePendingOrganizers = () => {
  return useQuery({
    queryKey: queryKeys.admin.pendingOrganizers(),
    queryFn: () => fetchApi<PendingOrganizer[]>("/api/admin/organizers"),
  });
};

const useOrganizerDecision = (action: "APPROVE" | "REJECT") => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: { id: string; reason?: string }) => {
      return fetchApi(`/api/admin/organizers/${args.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason: args.reason }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.pendingOrganizers(),
      });
    },
  });
};

export const useApproveOrganizer = () => useOrganizerDecision("APPROVE");
export const useRejectOrganizer = () => useOrganizerDecision("REJECT");
