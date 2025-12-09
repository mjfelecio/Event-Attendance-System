import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Record, NewRecord } from "@/globals/types/records";
import { StudentAttendanceRecord } from "@/globals/types/students";
import { AttendanceStatus } from "@prisma/client";
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
          ...(newRecord as Record),
          id: `temp-${Date.now()}`, // Temporary client-only ID
          createdAt: new Date(),
          updatedAt: new Date(),
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.records.fromEvent(eventId),
        exact: true,
      });
    },
  });
};

/**
 * Updates the attendance status of a single record.
 *
 * Uses optimistic updates so the UI feels instant.
 */
export const useUpdateRecordStatus = (eventId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recordId,
      status,
    }: {
      recordId: string;
      status: AttendanceStatus;
    }) => {
      return fetchApi<Record>(`/api/records/${recordId}/${status}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
    },

    onMutate: async ({ recordId, status }) => {
      const key = queryKeys.records.fromEvent(eventId);

      await queryClient.cancelQueries({ queryKey: key });

      // Snapshot current cache
      const previousRecords =
        queryClient.getQueryData<StudentAttendanceRecord[]>(key);

      // Optimistic in-place update
      if (previousRecords) {
        queryClient.setQueryData(
          key,
          previousRecords.map((record) =>
            record.id === recordId ? { ...record, status } : record
          )
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

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.records.fromEvent(eventId),
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
          previousRecords.filter((record) => record.id !== recordId)
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

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.records.fromEvent(eventId),
        exact: true,
      });
    },
  });
};

/**
 * Fetches all attendance records for an event.
 */
export const useAllRecordsFromEvent = (eventId?: string) => {
  return useQuery({
    queryKey: queryKeys.records.fromEvent(eventId!),
    enabled: !!eventId,
    queryFn: async () => {
      if (!eventId) return null;

      return fetchApi<StudentAttendanceRecord[]>(
        `/api/events/${eventId}/records`
      );
    },
  });
};

/**
 * Fetches the attendance record of a specific student in a specific event.
 *
 * Returns null when no record exists.
 */
export const useRecordOfStudentInEvent = (eventId?: string, studentId?: string) => {
  return useQuery({
    queryKey: queryKeys.records.fromEventForStudent(eventId!, studentId!),
    enabled: !!eventId && !!studentId,
    queryFn: async (): Promise<StudentAttendanceRecord | null> => {
      if (!eventId || !studentId) return null;

      return fetchApi<StudentAttendanceRecord>(
        `/api/records?eventId=${eventId}&studentId=${studentId}`
      );
    },
  });
};
