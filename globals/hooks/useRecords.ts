import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Record, NewRecord } from "@/globals/types/records";
import { StudentAttendanceRecord } from "../types/students";
import { AttendanceStatus } from "@prisma/client";

// Fetch event records
const fetchEventRecords = async (
  eventId: string
): Promise<StudentAttendanceRecord[]> => {
  const res = await fetch(`/api/events/${eventId}/records`);
  if (!res.ok) throw new Error("Failed to fetch event records");
  return await res.json();
};

// Update record status
const updateRecordStatus = async (
  recordId: string,
  status: AttendanceStatus
) => {
  const response = await fetch(`/api/records/${recordId}/${status}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update record");
  }
  return await response.json();
};

// Save (Add or Edit) a record
const saveRecord = async (record: Record | NewRecord) => {
  const res = await fetch("/api/records", {
    method: "POST",
    body: JSON.stringify(record),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to save record");
  return await res.json();
};

// Delete a record
const deleteRecord = async (id: string) => {
  const res = await fetch(`/api/records/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to delete record");
  return await res.json();
};

export const useSaveRecord = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveRecord,
    onMutate: async (newRecord) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({
        queryKey: ["event", eventId, "records"],
      });

      // Get previous data
      const previousRecords = queryClient.getQueryData<Record[] | NewRecord[]>([
        "event",
        eventId,
        "records",
      ]);

      // Optimistically add the new record
      if (previousRecords) {
        const optimisticRecord: Record | NewRecord = {
          ...newRecord,
          id: `temp-${Date.now()}`, // Temporary ID
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        queryClient.setQueryData(
          ["event", eventId, "records"],
          [...previousRecords, optimisticRecord]
        );
      }

      return { previousRecords };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousRecords) {
        queryClient.setQueryData(
          ["event", eventId, "records"],
          context.previousRecords
        );
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["event", eventId, "records"],
        exact: true,
      }),
  });
};

export const useUpdateRecordStatus = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      recordId,
      status,
    }: {
      recordId: string;
      status: AttendanceStatus;
    }) => updateRecordStatus(recordId, status),
    onMutate: async ({ recordId, status }) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({
        queryKey: ["event", eventId, "records"],
      });

      // Get previous data
      const previousRecords = queryClient.getQueryData<
        StudentAttendanceRecord[]
      >(["event", eventId, "records"]);

      // Optimistically update the record
      if (previousRecords) {
        queryClient.setQueryData(
          ["event", eventId, "records"],
          previousRecords.map((record) =>
            record.id === recordId ? { ...record, status } : record
          )
        );
      }

      return { previousRecords };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousRecords) {
        queryClient.setQueryData(
          ["event", eventId, "records"],
          context.previousRecords
        );
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["event", eventId, "records"],
        exact: true,
      }),
  });
};

export const useDeleteRecord = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRecord,
    onMutate: async (recordId) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({
        queryKey: ["event", eventId, "records"],
      });

      // Get previous data
      const previousRecords = queryClient.getQueryData<
        StudentAttendanceRecord[]
      >(["event", eventId, "records"]);

      // Optimistically remove the record
      if (previousRecords) {
        queryClient.setQueryData(
          ["event", eventId, "records"],
          previousRecords.filter((record) => record.id !== recordId)
        );
      }

      return { previousRecords };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousRecords) {
        queryClient.setQueryData(
          ["event", eventId, "records"],
          context.previousRecords
        );
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["event", eventId, "records"],
        exact: true,
      }),
  });
};

export const useEventAttendanceRecords = (eventId?: string) => {
  return useQuery({
    queryKey: ["event", eventId, "records"],
    queryFn: () => (eventId ? fetchEventRecords(eventId) : null),
    enabled: !!eventId,
  });
};

/**
 * Fetches the attendance record of a student in an event
 *
 * @returns StudentAttendanceRecord if it exists, and null otherwise
 */
export const useEventStudentRecord = (eventId?: string, studentId?: string) => {
  return useQuery({
    queryKey: ["record", eventId, studentId],
    enabled: !!eventId && !!studentId,
    queryFn: async () => {
      if (!eventId || !studentId) return null;

      const res = await fetch(
        `/api/records?eventId=${eventId}&studentId=${studentId}`
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }

      return await res.json();
    },
  });
};
