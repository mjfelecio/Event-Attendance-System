import { FaUser } from "react-icons/fa";
import { Student } from "@/globals/types/students";
import SearchBar from "./SearchBar";
import { useMemo, useState } from "react";
import useStudents, {
  useEventStudents,
  useStudent,
} from "@/globals/hooks/useStudents";
import { fullName } from "@/globals/utils/formatting";
import { Event } from "@/globals/types/events";
import { ComboBoxValue } from "@/globals/components/shared/ComboBox";

type DetailsDisplayProps = {
  data: Student | null;
  isLoading: boolean;
};

const DetailsDisplay = ({ data, isLoading }: DetailsDisplayProps) => {
  if (!data) {
    return (
      <div className="flex-1 flex items-center gap-2">
        <FaUser className="text-gray-400 text-3xl" />
        <p className="text-gray-500 text-3xl">No Student Found</p>
      </div>
    );
  }

  if (isLoading) return (
    <p>Loading...</p>
  )

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

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Student Details</h2>
      <div className="space-y-3 text-gray-700">
        <div>
          <strong>Name:</strong> {firstName} {middleName?.[0]}. {lastName}
        </div>
        <div>
          <strong>Student ID:</strong> {id}
        </div>
        <div>
          <strong>School Level:</strong> {schoolLevel}
        </div>
        {schoolLevel === "COLLEGE" && (
          <div>
            <strong>Program:</strong> {collegeProgram}
          </div>
        )}
        <div>
          <strong>Year Level:</strong> {yearLevel} - {section}
        </div>
        <div>
          <strong>Contact:</strong> {contactNumber}
        </div>
        <div>
          <strong>Status:</strong> {status}
        </div>
      </div>
    </>
  );
};

type StudentDetailsProps = {
  data: Student | null;
  selectedEvent: Event | null;
  onSelect: (studentId: string) => void;
};

const StudentDetails = ({
  selectedEvent,
  data,
  onSelect,
}: StudentDetailsProps) => {
  const [query, setQuery] = useState("");
  const { data: students, isLoading } = useEventStudents(selectedEvent?.id ?? null, query);

  const choices: ComboBoxValue[] = useMemo(() => {
    return (
      students?.map((student) => ({
        label: fullName(
          student.firstName,
          student.middleName ?? "",
          student.lastName
        ),
        value: student.id,
      })) ?? []
    );
  }, [students]);

  return (
    <div className="flex-1 flex flex-col rounded-md bg-white border-2 p-6 overflow-y-auto items-center justify-center">
      <div className="flex flex-row justify-self-start border-b-2 pb-4 w-full">
        <SearchBar
          onQueryChange={setQuery}
          placeholder="Search manually..."
          choices={choices}
          onSelect={onSelect}
        />
      </div>
      <DetailsDisplay data={data} isLoading={isLoading}/>
    </div>
  );
};

export default StudentDetails;
