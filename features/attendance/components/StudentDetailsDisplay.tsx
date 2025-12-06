import { Student, StudentAttendanceRecord } from "@/globals/types/students";
import { FaUser } from "react-icons/fa6";
import AttendanceActionButtons from "@/features/attendance/components/AttendanceActionButtons";
import { Event } from "@/globals/types/events";
import { memo } from "react";

type DetailsDisplayProps = {
  /** Student data to display */
  data: Student | null;
  event: Event;
  record?: StudentAttendanceRecord;
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
 * Empty state when no student is found
 */
const EmptyState = () => (
  <div className="flex-1 flex items-center justify-center gap-3">
    <FaUser className="text-gray-300 text-4xl" />
    <p className="text-gray-400 text-2xl font-medium">No Student Found</p>
  </div>
);

/**
 * Displays detailed information about a student
 */
const StudentDetailsDisplay = ({
  event,
  data,
  record,
  isLoading,
}: DetailsDisplayProps) => {
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
      <div className="flex flex-row justify-between mb-6 pb-3 border-b-2">
        <h2 className="text-2xl font-bold text-gray-900">Student Details</h2>
        <AttendanceActionButtons
          recordId={record?.id}
          eventId={event.id}
          studentId={data.id}
        />
      </div>

      <div className="space-y-4">
        <DetailRow label="Name" value={fullNameDisplay} />
        <DetailRow label="Student ID" value={id} />
        <DetailRow label="School Level" value={schoolLevel} />
        <DetailRow
          label="Program"
          value={collegeProgram || "N/A"}
          show={isCollege}
        />
        <DetailRow label="Year & Section" value={`${yearLevel} - ${section}`} />
        <DetailRow label="Contact Number" value={contactNumber ?? "None"} />
        <DetailRow label="Status" value={status} />
      </div>
    </div>
  );
};

export default memo(StudentDetailsDisplay);
