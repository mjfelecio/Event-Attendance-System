import { Student, StudentAttendanceRecord } from "@/globals/types/students";
import { FaUser } from "react-icons/fa6";
import AttendanceActionButtons from "@/features/attendance/components/AttendanceActionButtons";
import { Event } from "@/globals/types/events";
import { memo } from "react";
import AttendanceStatusCard from "@/features/attendance/components/AttendanceStatusCard";
import { capitalize } from "lodash";
import { Record } from "@/globals/types/records";

type DetailRowProps = {
  label: string;
  value: string | number;
  show?: boolean;
};

function formatDate(date: Date) {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const DetailRow = ({ label, value, show = true }: DetailRowProps) => {
  if (!show) return null;
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </span>
      <span className="text-base font-medium text-gray-900">{value}</span>
    </div>
  );
};

const LoadingState = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="flex items-center gap-3">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
      <p className="text-gray-600 text-lg">Loading student details...</p>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex-1 flex items-center justify-center gap-4 flex-col">
    <FaUser className="text-gray-300 text-6xl" />
    <p className="text-gray-400 text-2xl font-medium">No Student Found</p>
  </div>
);

type Props = {
  student: Student | null;
  event: Event;
  record: Record | null;
  isLoading: boolean;
};

const StudentDetails = ({ event, student, record, isLoading }: Props) => {
  if (isLoading) return <LoadingState />;
  if (!student) return <EmptyState />;

  const {
    id,
    firstName,
    middleName,
    lastName,
    schoolLevel,
    yearLevel,
    collegeProgram,
    shsStrand,
    section,
    house,
    department,
  } = student;

  const middleInitial = middleName?.[0] ? `${middleName[0]}.` : "";
  const fullNameDisplay = `${firstName} ${middleInitial} ${lastName}`.trim();
  const isCollege = schoolLevel === "COLLEGE";
  const isSHS = schoolLevel === "SHS";
  // program or strand + year + section letter
  const fullSection = `${
    isCollege ? collegeProgram : shsStrand
  } - ${section} • ${id}`;
  const timeIn = record?.timein ? formatDate(new Date(record?.timein)) : "N/A";
  const timeOut = record?.timeout
    ? formatDate(new Date(record?.timeout))
    : "N/A";

  return (
    <div className="flex flex-1 w-full bg-white rounded-xl">
      {/* Left side (Attendance Status n' stuff) */}
      <div className="flex flex-col gap-4 pt-6 p-2 bg-gray-50/50 items-center">
        <AttendanceStatusCard status={record ? "present" : "absent"} />

        <div className="flex flex-col gap-4 items-center">
          <p className="font-medium border-b-2">Actions</p>
          <AttendanceActionButtons
            recordId={record?.id}
            eventId={event.id}
            studentId={student.id}
          />
        </div>
      </div>

      {/* Right side (Student details) */}
      <div className="flex-1 bg-white border-l p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {fullNameDisplay}
            </h2>
            <p className="text-gray-500 mt-1 text-md">{fullSection}</p>
          </div>
        </div>

        {/* Student Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <DetailRow
            label="Type"
            value={`${capitalize(schoolLevel)} Student`}
          />
          {isCollege && (
            <DetailRow label="Program" value={collegeProgram || "N/A"} />
          )}
          {isSHS && <DetailRow label="Strand" value={shsStrand || "N/A"} />}
          <DetailRow
            label="Year & Section"
            value={`${yearLevel} - ${section}`}
          />
          <DetailRow label="Department" value={department || "N/A"} />
          <DetailRow label="House" value={house || "N/A"} />
        </div>

        {/* Attendance record / status row */}
        {record && (
          <>
            <div className="mt-6 border-t-2 border-t-gray-100 pt-2 flex justify-between items-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Time In at
              </p>
              <span className="text-base font-medium text-gray-900">
                {timeIn}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Time Out at
              </p>
              <span className="text-base font-medium text-gray-900">
                {timeOut}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default memo(StudentDetails);
