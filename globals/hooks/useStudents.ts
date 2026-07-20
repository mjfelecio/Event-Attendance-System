import { useQuery } from "@tanstack/react-query";
import { Student, StudentAPI } from "@/globals/types/students";
import { useMemo } from "react";
import { filterAndSortStudents } from "@/globals/utils/fuzzySearch";
import { fetchApi } from "@/globals/utils/api";
import { queryKeys } from "@/globals/utils/queryKeys";
import { useDebouncedValue } from "@/globals/hooks/useDebouncedValue";

// Transform function to make sure that the dates are actually a Date object
const transformStudent = (e: StudentAPI): Student => ({
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

/**
 * Fetches students included in an event, searched and bounded server-side.
 * The name query is debounced so typing doesn't fire a request per keystroke,
 * and the server caps the result set instead of shipping every eligible row.
 */
export const useEventStudents = (eventId?: string, query?: string) => {
  const debouncedQuery = useDebouncedValue(query ?? "", 300);

  const { data: students, ...queryResult } = useQuery({
    queryKey: queryKeys.students.fromEvent(eventId!, debouncedQuery),
    enabled: !!eventId,
    queryFn: async () => {
      if (!eventId) return [];

      const params = new URLSearchParams({ limit: "50" });
      if (debouncedQuery) params.set("q", debouncedQuery);

      const students = await fetchApi<StudentAPI[]>(
        `/api/events/${eventId}/students?${params.toString()}`
      );
      return students.map(transformStudent);
    },
  });

  return {
    ...queryResult,
    data: students,
  };
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

/** Roster category counts, computed server-side (no full-roster download). */
export const useStudentStats = () => {
  return useQuery({
    queryKey: queryKeys.students.stats(),
    queryFn: () =>
      fetchApi<{ all: number; college: number; shs: number; house: number }>(
        "/api/students/stats"
      ),
  });
};

/** Distinct section names that exist on students (no full-roster download). */
export const useStudentSections = () => {
  return useQuery({
    queryKey: queryKeys.students.sections(),
    queryFn: () => fetchApi<string[]>("/api/students/sections"),
  });
};

export default useStudents;
