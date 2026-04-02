import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "../utils/api";
import { EventCategory, Group } from "@prisma/client";

type GroupsByCategory = Record<EventCategory, Group[]>;

export const useFetchGroupsForStudent = (studentId?: string) => {
  return useQuery({
    queryKey: ["groups", "byStudentId", studentId],
    enabled: !!studentId,
    queryFn: () => {
      return fetchApi<GroupsByCategory>(`/api/groups/for-student/${studentId}`);
    },
  });
};
