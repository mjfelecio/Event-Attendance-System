import { useQuery } from "@tanstack/react-query";
import { Student } from "@/globals/types/students";
import { useMemo } from "react";
import { filterAndSortStudents } from "../utils/fuzzySearch";

type StudentAPI = Omit<Student, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

// Transform function to make sure that the dates are actually a Date object
const transformStudent = (e: StudentAPI): Student => ({
  ...e,
  createdAt: new Date(e.createdAt),
  updatedAt: new Date(e.updatedAt),
});

// Fetch
export const fetchStudents = async (): Promise<Student[]> => {
  const res = await fetch("/api/students");
  if (!res.ok) throw new Error("Failed to fetch events");

  const data: StudentAPI[] = await res.json();
  return data.map(transformStudent);
};

// Fetch
export const fetchEventStudents = async (
  eventId: string
): Promise<Student[]> => {
  const res = await fetch(`/api/events/${eventId}/students`);
  if (!res.ok) throw new Error("Failed to fetch events");

  const data: StudentAPI[] = await res.json();
  return data.map(transformStudent);
};

// Fetch a single student
export const fetchStudentById = async (id: string): Promise<Student> => {
  const res = await fetch(`/api/students/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Student not found");
    throw new Error("Failed to fetch student");
  }

  const data: StudentAPI = await res.json();
  return transformStudent(data);
};

const useStudents = (query?: string) => {
  const { data: students, ...queryResult } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
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

export const useEventStudents = (eventId: string | null, query?: string) => {
  const { data: students, ...queryResult } = useQuery({
    queryKey: [eventId, "students"],
    enabled: !!eventId,
    queryFn: () => fetchEventStudents(eventId!),
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

export const useStudent = (id: string) => {
  return useQuery({
    queryKey: ["student", id],
    queryFn: () => fetchStudentById(id),
    // Only run the query if an ID is provided
    enabled: !!id,
  });
};

export default useStudents;
