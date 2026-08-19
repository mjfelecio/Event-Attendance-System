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
      // The whole `["admin"]` prefix: a decision moves the user out of the
      // pending queue AND changes their row in the console's user directory.
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all() });
    },
  });
};

export const useApproveOrganizer = () => useOrganizerDecision("APPROVE");
export const useRejectOrganizer = () => useOrganizerDecision("REJECT");

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "ORGANIZER";
  status: "PENDING" | "ACTIVE" | "REJECTED";
  rejectionReason: string | null;
  mustChangePassword: boolean;
  createdAt: string;
};

/** Every user, for the operator console's directory. Admin only server-side. */
export const useUsers = () => {
  return useQuery({
    queryKey: queryKeys.admin.users(),
    queryFn: () => fetchApi<ManagedUser[]>("/api/admin/users"),
  });
};

export type TemporaryPasswordResult = {
  id: string;
  name: string;
  email: string;
  /** Shown once and never retrievable again. */
  temporaryPassword: string;
};

export const useResetUserPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      fetchApi<TemporaryPasswordResult>(
        `/api/admin/users/${userId}/password`,
        { method: "PATCH" },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all() });
    },
  });
};

export type SystemInfo = {
  nodeEnv: string;
  databaseFile: string;
  authSecret: {
    configured: boolean;
    meetsMinLength: boolean;
    usingDevFallback: boolean;
  };
  appVersion: string;
  serverTime: string;
  counts: {
    students: number;
    groups: number;
    events: number;
    records: number;
    users: number;
  };
};

export const useSystemInfo = () => {
  return useQuery({
    queryKey: queryKeys.admin.system(),
    queryFn: () => fetchApi<SystemInfo>("/api/admin/system"),
    // serverTime is only useful if it is actually current.
    staleTime: 0,
  });
};
