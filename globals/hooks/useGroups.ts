import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "../utils/api";
import { EventCategory, Group } from "@prisma/client";

type GroupsByCategory = Record<EventCategory, Group[]>;

export const useFetchGroupsForStudent = (studentId?: string) => {
  return useQuery({
    queryKey: ["groups", "byStudentId", studentId],
    enabled: !!studentId,
    queryFn: () => {
      return fetchApi<GroupsByCategory>(`/api/groups/forStudent/${studentId}`);
    },
		staleTime: 0
  });
};

export const useFetchGroupsByCategory = (eventCategory?: EventCategory) => {
  return useQuery({
    queryKey: ["groups", "by-category", eventCategory],
    enabled: !!eventCategory,
    queryFn: () => {
      return fetchApi<Group[]>(`/api/groups/byCategory/${eventCategory}`);
    },
    staleTime: 1000 * 60 * 5,
  });
};