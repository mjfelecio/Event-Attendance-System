import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Student, StudentAPI, StudentAPIWithGroups, StudentWithGroups } from "@/globals/types/students";
import { useMemo } from "react";
import { filterAndSortStudents } from "@/globals/utils/fuzzySearch";
import { fetchApi } from "@/globals/utils/api";
import { queryKeys } from "@/globals/utils/queryKeys";
import { EventCategory } from "@prisma/client";
import { StudentFormData } from "@/features/manage-list/types/add-dialog/AddStudentDialog.types";

// Transform function to make sure that the dates are actually a Date object
const transformStudent = (e: StudentAPI | StudentAPIWithGroups): StudentWithGroups => ({
  ...e,
  createdAt: new Date(e.createdAt),
  updatedAt: new Date(e.updatedAt),
});

/** Fetches all students */
const useStudents = (query?: string) => {
  const { data: students, ...queryResult } = useQuery({
    queryKey: queryKeys.students.all(),
    queryFn: async (): Promise<Student[]> => {
      const students = await fetchApi<StudentAPI[]>("/api/students");
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

/** Fetches all students included in an event */
export const useEventStudents = (eventId?: string, query?: string) => {
  const { data: students, ...queryResult } = useQuery({
    queryKey: queryKeys.students.fromEvent(eventId!),
    enabled: !!eventId,
    queryFn: async () => {
      if (!eventId) return;

      const students = await fetchApi<StudentAPI[]>(
        `/api/events/${eventId}/students`
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

      const student = await fetchApi<StudentAPI>(`/api/students/${studentId}`);
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

      const student = await fetchApi<StudentAPI>(
        `/api/events/${eventId}/students/${studentId}`
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
    queryKey: ['stats', 'students'],
    queryFn: async () => {
      return fetchApi<Record<EventCategory, number>>(`/api/stats/student-counts`);
    },
  });
};

/**
 * Fetches students based on active search filters.
 * @param filters - The parsed object from your querySchema (category, house, etc.)
 * @param searchQuery - Optional client-side string for immediate fuzzy filtering (e.g., name)
 */
export const useStudentsV2 = (filters: any = {}, searchQuery?: string) => {
  // 1. Generate the query string from the filters object
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });
    return params.toString();
  }, [filters]);

  const { data: students, ...queryResult } = useQuery({
    // 2. Include queryString in the key so React Query refetches when filters change
    queryKey: [...queryKeys.students.all(), queryString],
    queryFn: async (): Promise<StudentWithGroups[]> => {
      const url = queryString ? `/api/students?${queryString}` : "/api/students";
      const data = await fetchApi<StudentAPIWithGroups[]>(url);
      return data.map(transformStudent);
    },
  });

  // TODO: RETHINK THIS APPROACH IN THE FUTURE
  const filteredStudents = useMemo(() => {
    if (!students) return undefined;
    if (!searchQuery) return students;

    return filterAndSortStudents(students, searchQuery);
  }, [students, searchQuery]);

  return {
    ...queryResult,
    data: filteredStudents,
  };
};

/**
 * Creates or Edit a student
 *
 * @returns created or edited Student object
 */
export const useSaveStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (student: StudentFormData) => {
      return fetchApi<StudentFormData>("/api/events", {
        method: "POST",
        body: JSON.stringify(event),
        headers: { "Content-Type": "application/json" },
      });
    },

    // TODO: Replace this with optimistic handling and manual adding of the data
    // Instead of revalidating the whole thing, which hits the backend
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all() }),
  });
};

export default useStudents;
