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
  const res = await fetch("/api/records", {
    method: "DELETE",
    body: JSON.stringify({ id }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to delete record");
  return await res.json();
};

// Custom hooks
export const useSaveRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveRecord,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["records"] }),
  });
};

export const useUpdateRecordStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      recordId,
      status,
    }: {
      recordId: string;
      status: AttendanceStatus;
    }) => updateRecordStatus(recordId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["records"] }),
  });
};

export const useDeleteRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRecord,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["records"] }),
  });
};

export const useEventAttendanceRecords = (eventId: string) => {
  return useQuery({
    queryKey: ["event", eventId, "records"],
    queryFn: () => fetchEventRecords(eventId),
  });
};
