import { FaUser } from "react-icons/fa";
import { useMemo, useState } from "react";
import { Student } from "@/globals/types/students";
import { Event } from "@/globals/types/events";
import { ComboBoxValue } from "@/globals/components/shared/ComboBox";
import { useEventStudents } from "@/globals/hooks/useStudents";
import { fullName } from "@/globals/utils/formatting";
import SearchBar from "./SearchBar";

// ============================================================================
// Types
// ============================================================================

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

type DetailsDisplayProps = {
  /** Student data to display */
  data: Student | null;
  /** Whether the data is currently being fetched */
  isLoading: boolean;
};

type DetailRowProps = {
  /** Label for the detail */
  label: string;
  /** Value to display */
  value: string | number;
  /** Optional condition to render the row */
  show?: boolean;
};

// ============================================================================
// Sub-components
// ============================================================================

/**
 * Displays a single row of student details
 */
const DetailRow = ({ label, value, show = true }: DetailRowProps) => {
  if (!show) return null;
  
  return (
    <div className="flex gap-2">
      <span className="font-semibold text-gray-900">{label}:</span>
      <span className="text-gray-700">{value}</span>
    </div>
  );
};

/**
 * Empty state when no student is found
 */
const EmptyState = () => (
  <div className="flex-1 flex items-center justify-center gap-3">
    <FaUser className="text-gray-300 text-4xl" />
    <p className="text-gray-400 text-2xl font-medium">No Student Found</p>
  </div>
);

/**
 * Loading state while fetching student data
 */
const LoadingState = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="flex items-center gap-2">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
      <p className="text-gray-600">Loading student details...</p>
    </div>
  </div>
);

/**
 * Displays detailed information about a student
 */
const DetailsDisplay = ({ data, isLoading }: DetailsDisplayProps) => {
  if (isLoading) return <LoadingState />;
  if (!data) return <EmptyState />;

  const {
    id,
    firstName,
    middleName,
    lastName,
    schoolLevel,
    yearLevel,
    collegeProgram,
    contactNumber,
    section,
    status,
  } = data;

  const middleInitial = middleName?.[0] ? `${middleName[0]}.` : "";
  const fullNameDisplay = `${firstName} ${middleInitial} ${lastName}`.trim();
  const isCollege = schoolLevel === "COLLEGE";

  return (
    <div className="flex-1 w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2">
        Student Details
      </h2>
      
      <div className="space-y-4">
        <DetailRow label="Name" value={fullNameDisplay} />
        <DetailRow label="Student ID" value={id} />
        <DetailRow label="School Level" value={schoolLevel} />
        <DetailRow 
          label="Program" 
          value={collegeProgram || "N/A"} 
          show={isCollege} 
        />
        <DetailRow 
          label="Year & Section" 
          value={`${yearLevel} - ${section}`} 
        />
        <DetailRow label="Contact Number" value={contactNumber ?? "None"} />
        <DetailRow 
          label="Status" 
          value={status}
        />
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

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

  const { data: students } = useEventStudents(
    selectedEvent?.id ?? null,
    query
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
        <DetailsDisplay data={data} isLoading={isFetching} />
      </div>
    </div>
  );
};

export default StudentDetails;