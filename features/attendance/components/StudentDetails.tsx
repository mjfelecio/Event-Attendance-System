import { useMemo, useState } from "react";
import { Student } from "@/globals/types/students";
import { Event } from "@/globals/types/events";
import { ComboBoxValue } from "@/globals/components/shared/ComboBox";
import { useEventStudents } from "@/globals/hooks/useStudents";
import { fullName } from "@/globals/utils/formatting";
import SearchBar from "@/features/attendance/components/SearchBar";
import {
  useEventAttendanceRecords,
  useEventStudentRecord,
} from "@/globals/hooks/useRecords";
import StudentDetailsDisplay from "@/features/attendance/components/StudentDetailsDisplay";

type StudentDetailsProps = {
  /** The currently selected student data to display */
  data: Student | null;
  /** The event context for filtering students */
  selectedEvent: Event | null;
  /** Whether the current student to be displayed is being fetched */
  isFetching: boolean;
  /** Callback when a student is selected from search */
  onSelect: (studentId: string) => void;
};

/**
 * StudentDetails component displays student information with search functionality
 *
 * Features:
 * - Search students by name within an event context
 * - Display detailed student information
 * - Loading and empty states
 *
 * @component
 *
 * @example
 * ```tsx
 * <StudentDetails
 *   data={selectedStudent}
 *   selectedEvent={event}
 *   onSelect={(id) => setSelectedStudentId(id)}
 * />
 * ```
 */
const StudentDetails = ({
  selectedEvent,
  data,
  isFetching,
  onSelect,
}: StudentDetailsProps) => {
  const [query, setQuery] = useState("");

  const { data: students } = useEventStudents(selectedEvent?.id ?? null, query);
  const { data: studentRecord } = useEventStudentRecord(selectedEvent?.id, data?.id);

  const searchChoices: ComboBoxValue[] = useMemo(() => {
    if (!students) return [];

    return students.map((student) => ({
      label: fullName(
        student.firstName,
        student.middleName ?? "",
        student.lastName
      ),
      value: student.id,
    }));
  }, [students]);

  if (!selectedEvent) return null;

  return (
    <div className="flex-1 flex flex-col bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      {/* Search Header */}
      <div className="border-b-2 border-gray-200 p-6 bg-gray-50">
        <SearchBar
          onQueryChange={setQuery}
          placeholder="Search student by name..."
          choices={searchChoices}
          onSelect={onSelect}
        />
      </div>

      {/* Details Content */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        <StudentDetailsDisplay
          event={selectedEvent}
          data={data}
          record={studentRecord ?? undefined}
          isLoading={isFetching}
        />
      </div>
    </div>
  );
};

export default StudentDetails;
