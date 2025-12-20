import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Student } from "@/globals/types/students";
import { Event } from "@/globals/types/events";
import { ComboBoxValue } from "@/globals/components/shared/ComboBox";
import { useEventStudents } from "@/globals/hooks/useStudents";
import { fullName } from "@/globals/utils/formatting";
import SearchBar from "@/features/attendance/components/SearchBar";
import { useRecordOfStudentInEvent } from "@/globals/hooks/useRecords";
import StudentDetails from "@/features/attendance/components/StudentDetails";

type StudentDetailsProps = {
  /** The student scanned in the scanner */
  displayedStudent: Student | null;
  /** The event context for filtering students */
  selectedEvent: Event | null;
  /** Whether the current student to be displayed is being fetched */
  isFetching: boolean;
  /** Callback when a student is selected from search */
  onSelect: (student: Student) => void;
};

/**
 * StudentDetails component displays student information with search functionality
 *
 * Features:
 * - Search students by name within an event context
 * - Display detailed student information
 * - Loading and empty states
 */
const ManualAttendanceSection = ({
  selectedEvent,
  displayedStudent,
  isFetching,
  onSelect
}: StudentDetailsProps) => {
  const [query, setQuery] = useState("");

  const { data: students } = useEventStudents(selectedEvent?.id, query);
  const { data: studentRecord } = useRecordOfStudentInEvent(
    selectedEvent?.id,
    displayedStudent?.id
  );

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

  const handleSelectStudent = useCallback((studentId: string) => {
    const selectedStudent = students?.find((s) => s.id === studentId);
    if (!selectedStudent) return;

    onSelect(selectedStudent);
  }, [students]);

  if (!selectedEvent) return null;

  return (
    <div className="flex-1 flex flex-col bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      {/* Search Header */}
      <div className="border-b-2 border-gray-200 p-4 bg-gray-50">
        <SearchBar
          onQueryChange={setQuery}
          placeholder="Search student by name..."
          choices={searchChoices}
          onSelect={handleSelectStudent}
        />
      </div>

      {/* Details Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <StudentDetails
          event={selectedEvent}
          student={displayedStudent}
          record={studentRecord ?? null}
          isLoading={isFetching}
        />
      </div>
    </div>
  );
};

export default ManualAttendanceSection
