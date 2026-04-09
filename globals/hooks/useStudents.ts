import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Student, StudentDTO } from "@/globals/types/students";
import { useMemo } from "react";
import { filterAndSortStudents } from "@/globals/utils/fuzzySearch";
import { fetchApi } from "@/globals/utils/api";
import { queryKeys } from "@/globals/utils/queryKeys";
import { EventCategory } from "@prisma/client";
import { StudentFormValues } from "../schemas/studentSchema";

// Transform function to make sure that the dates are actually a Date object
const transformStudent = (e: StudentDTO | StudentDTO): Student => ({
  ...e,
  createdAt: new Date(e.createdAt),
  updatedAt: new Date(e.updatedAt),
});

/** Fetches all students included in an event */
export const useEventStudents = (eventId?: string, query?: string) => {
  const { data: students, ...queryResult } = useQuery({
    queryKey: queryKeys.students.fromEvent(eventId!),
    enabled: !!eventId,
    queryFn: async () => {
      if (!eventId) return;

      const students = await fetchApi<StudentDTO[]>(
        `/api/events/${eventId}/students`,
      );
      return students.map(transformStudent);
    },
  });

  // Memoize filtered and sorted results
  const filteredStudents = useMemo(() => {
    if (!students) return undefined;
    return filterAndSortStudents(students, query);
  }, [students, query]);

  return {
    ...queryResult,
    data: filteredStudents,
  };
};

/**
 * Fetches a student through studentId
 */
export const useStudent = (studentId?: string) => {
  return useQuery({
    queryKey: queryKeys.students.withId(studentId!),
    enabled: !!studentId,
    queryFn: async () => {
      if (!studentId) return;

      const student = await fetchApi<StudentDTO>(`/api/students/${studentId}`);
      return transformStudent(student);
    },
  });
};

/**
 * Fetches a student that is included in the event through eventId and studentId
 *
 * @returns Student, null if they do not exist or is not included in the event
 */
export const useStudentFromEvent = ({
  eventId,
  studentId,
}: {
  eventId?: string;
  studentId?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.students.fromEventWithId(eventId!, studentId!),
    enabled: !!eventId && !!studentId,
    queryFn: async () => {
      if (!eventId || !studentId) return null;

      const student = await fetchApi<StudentDTO>(
        `/api/events/${eventId}/students/${studentId}`,
      );
      return transformStudent(student);
    },
  });
};

/**
 * Fetches a student through studentId
 */
export const useStudentsStats = () => {
  return useQuery({
    queryKey: ["stats", "students"],
    queryFn: async () => {
      return fetchApi<Record<EventCategory, number>>(
        `/api/stats/student-counts`,
      );
    },
  });
};

/**
 * Fetches students based on active search filters.
 * @param filters - The parsed object from your querySchema (category, house, etc.)
 */
export const useFetchStudents = (filters: any = {}) => {
  // Generate the query string from the filters object
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });
    return params.toString();
  }, [filters]);

  return useQuery({
    queryKey: [...queryKeys.students.all(), queryString],
    queryFn: async (): Promise<Student[]> => {
      const url = queryString
        ? `/api/students?${queryString}`
        : "/api/students";
      const data = await fetchApi<StudentDTO[]>(url);
      return data.map(transformStudent);
    },
  });
};

/**
 * Creates or Edit a student
 *
 * @returns created or edited Student object
 */
export const useSaveStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (student: StudentFormValues) => {
      return fetchApi<Student>("/api/students", {
        method: "POST",
        body: JSON.stringify(student),
        headers: { "Content-Type": "application/json" },
      });
    },

    // TODO: Replace this with optimistic handling and manual adding of the data
    // Instead of revalidating the whole thing, which hits the backend
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all() }),
  });
};

/**
 * Deletes a student
 *
 * @returns deleted Student
 */
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      return fetchApi<Student>(`/api/students/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all() }),
  });
};
