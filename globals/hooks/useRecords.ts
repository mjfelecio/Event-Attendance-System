import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Record, NewRecord } from "@/globals/types/records";

type RecordAPI = Omit<Record, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

// Transform function to ensure that the dates are Date objects
const transformRecord = (r: RecordAPI): Record => ({
  ...r,
  createdAt: new Date(r.createdAt),
  updatedAt: new Date(r.updatedAt),
});

// Fetch all records
export const fetchRecords = async (): Promise<Record[]> => {
  const res = await fetch("/api/records");
  if (!res.ok) throw new Error("Failed to fetch records");

  const data: RecordAPI[] = await res.json();
  return data.map(transformRecord);
};

// Save (Add or Edit) a record
const saveRecord = async (record: Record | NewRecord) => {
  const res = await fetch("/api/records", {
    method: "POST",
    body: JSON.stringify(record),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to save record");
  return res.json();
};

const deleteRecord = async (id: string) => {
  const res = await fetch("/api/records", {
    method: "DELETE",
    body: JSON.stringify({ id }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to delete record");
  return res.json();
};

export const useSaveRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveRecord,
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

const useRecords = () => {
  return useQuery({
    queryKey: ["records"],
    queryFn: fetchRecords,
  });
};

export default useRecords;
