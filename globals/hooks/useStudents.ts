import { useQuery } from "@tanstack/react-query";
import { Student, StudentAPI } from "@/globals/types/students";
import { useMemo } from "react";
import { filterAndSortStudents } from "@/globals/utils/fuzzySearch";
import { fetchApi } from "@/globals/utils/api";
import { queryKeys } from "@/globals/utils/queryKeys";

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

export default useStudents;
