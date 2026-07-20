import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Record, NewRecord } from "@/globals/types/records";
import { StudentAttendanceRecord } from "@/globals/types/students";
import { fetchApi } from "@/globals/utils/api";
import { queryKeys } from "@/globals/utils/queryKeys";

/**
 * Creates a new attendance record.
 *
 * Uses optimistic updates to immediately reflect the new record in the UI
 * before the server confirms the change.
 */
export const useCreateRecord = (eventId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (record: NewRecord) => {
      return fetchApi<Record>("/api/records", {
        method: "POST",
        body: JSON.stringify(record),
        headers: { "Content-Type": "application/json" },
      });
    },

    /** Runs before the mutation request is sent */
    onMutate: async (newRecord) => {
      const key = queryKeys.records.fromEvent(eventId);

      // Cancel outgoing refetches to prevent overwriting optimistic state
      await queryClient.cancelQueries({ queryKey: key });

      // Snapshot current cache state so we can rollback if needed
      const previousRecords =
        queryClient.getQueryData<(Record | NewRecord)[]>(key);

      // Apply optimistic update
      if (previousRecords) {
        const optimisticRecord: Record = {
          ...newRecord,
          id: `temp-${Date.now()}`, // Temporary client-only ID
          createdAt: new Date(),
          updatedAt: new Date(),
          timein: new Date(),
          timeout: null,
          recordedById: null,
          lastModifiedById: null,
        };

        queryClient.setQueryData(key, [...previousRecords, optimisticRecord]);
      }

      // Return context for rollback in onError
      return { previousRecords };
    },

    /** Rollback optimistic update if server request fails */
    onError: (_err, _variables, context) => {
      const key = queryKeys.records.fromEvent(eventId);
      if (context?.previousRecords) {
        queryClient.setQueryData(key, context.previousRecords);
      }
    },

    /** Re-sync server state after success */
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.records.fromEvent(eventId),
        exact: true,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.records.fromEventForStudent(eventId, data.studentId),
        exact: true,
      });

      // Dashboard/report numbers depend on records - keep them fresh
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.statsFromEvent(eventId),
        exact: true,
      });
    },
  });
};

/**
 * Updates an attendance record.
 *
 * Uses optimistic updates to immediately reflect the new record in the UI
 * before the server confirms the change.
 */
export const useUpdateAttendanceRecord = (eventId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recordId: string) => {
      return fetchApi<Record>(`/api/records/${recordId}`, {
        method: "PATCH",
      });
    },

    /** Runs before the mutation request is sent */
    onMutate: async (recordId) => {
      const key = queryKeys.records.fromEvent(eventId);

      // Cancel outgoing refetches to prevent overwriting optimistic state
      await queryClient.cancelQueries({ queryKey: key });

      // Snapshot current cache state so we can rollback if needed
      const previousRecords = queryClient.getQueryData<Record[]>(key);

      const existingRecord = previousRecords?.find((r) => r.id === recordId);

      // Apply optimistic update - replace the row in place (appending would
      // show the record twice until the refetch lands)
      if (previousRecords && existingRecord) {
        queryClient.setQueryData(
          key,
          previousRecords.map((r) =>
            r.id === recordId ? { ...r, timeout: new Date() } : r
          )
        );
      }

      // Return context for rollback in onError
      return { previousRecords };
    },

    /** Rollback optimistic update if server request fails */
    onError: (_err, _variables, context) => {
      const key = queryKeys.records.fromEvent(eventId);
      if (context?.previousRecords) {
        queryClient.setQueryData(key, context.previousRecords);
      }
    },

    /** Re-sync server state after success */
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.records.fromEvent(eventId),
        exact: true,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.records.fromEventForStudent(eventId, data.studentId),
        exact: true,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.events.statsFromEvent(eventId),
        exact: true,
      });
    },
  });
};

/**
 * Deletes a single attendance record.
 *
 * Uses optimistic removal so the row disappears instantly.
 */
export const useDeleteRecord = (eventId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return fetchApi<Record>(`/api/records/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    },

    onMutate: async (recordId) => {
      const key = queryKeys.records.fromEvent(eventId);

      await queryClient.cancelQueries({ queryKey: key });

      const previousRecords =
        queryClient.getQueryData<StudentAttendanceRecord[]>(key);

      // Optimistically remove record from cache
      if (previousRecords) {
        queryClient.setQueryData(
          key,
          previousRecords.filter((record) => record.id !== recordId),
        );
      }

      return { previousRecords };
    },

    onError: (_err, _vars, context) => {
      const key = queryKeys.records.fromEvent(eventId);
      if (context?.previousRecords) {
        queryClient.setQueryData(key, context.previousRecords);
      }
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.records.fromEvent(eventId),
        exact: true,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.records.fromEventForStudent(eventId, data.studentId),
        exact: true,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.events.statsFromEvent(eventId),
        exact: true,
      });
    },
  });
};

/**
 * Fetches all attendance records for an event.
 */
/**
 * @param live When true (the attendance screen), poll so scans from another
 *   device appear without a manual refresh. staleTime marks data eligible for
 *   refetch but doesn't trigger one; with focus refetch off, only this interval
 *   keeps a passive device fresh. Leave false (report pages) so completed
 *   events don't poll - `enabled: !!eventId` only means an id exists.
 */
export const useAllRecordsFromEvent = (eventId?: string, live = false) => {
  return useQuery({
    queryKey: queryKeys.records.fromEvent(eventId!),
    enabled: !!eventId,
    queryFn: async () => {
      if (!eventId) return null;

      return fetchApi<StudentAttendanceRecord[]>(
        `/api/events/${eventId}/records`,
      );
    },
    ...(live
      ? {
          staleTime: 5_000,
          refetchInterval: 8_000,
          refetchIntervalInBackground: false,
        }
      : {}),
  });
};

/**
 * Fetches the attendance record of a specific student in a specific event.
 *
 * Returns null when no record exists.
 */
export const useRecordOfStudentInEvent = (
  eventId?: string,
  studentId?: string,
) => {
  return useQuery({
    queryKey: queryKeys.records.fromEventForStudent(eventId!, studentId!),
    enabled: !!eventId && !!studentId,
    queryFn: async () => {
      if (!eventId || !studentId) return null;

      return fetchApi<Record>(
        `/api/records?eventId=${eventId}&studentId=${studentId}`,
      );
    },
  });
};
