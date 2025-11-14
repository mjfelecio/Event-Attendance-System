import { FaUser } from "react-icons/fa";
import { Student } from "@/globals/types/students";
import SearchBar from "./SearchBar";
import { useState } from "react";
import useStudents, { useEventStudents, useStudent } from "@/globals/hooks/useStudents";
import { fullName } from "@/globals/utils/formatting";
import { Event } from "@/globals/types/events";

type Props = {
  data: Student | null;
  selectedEvent: Event | null;
};

type DetailsDisplayProps = {
  data: Student | null;
};

type SearchToolbarProps = {
  onQueryChange: (query: string) => void;
  placeholder?: string;
};

const SearchToolbar = ({ onQueryChange }: SearchToolbarProps) => {
  return (
    <div className="flex flex-row justify-self-start border-b-2 pb-4 w-full">
      <SearchBar
        onQueryChange={onQueryChange}
        placeholder="Search manually..."
      />
    </div>
  );
};

const DetailsDisplay = ({ data }: DetailsDisplayProps) => {
  if (!data) {
    return (
      <div className="flex-1 flex items-center gap-2">
        <FaUser className="text-gray-400 text-3xl" />
        <p className="text-gray-500 text-3xl">No Student Found</p>
      </div>
    );
  }
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

const StudentDetails = ({ selectedEvent, data }: Props) => {
  const [query, setQuery] = useState("");
  const { data: students } = useEventStudents(selectedEvent?.id ?? null, query);

  const handleQueryChange = (query: string) => {
    setQuery(query);
  };

  return (
    <div className="flex-1 flex flex-col rounded-md bg-white border-2 p-6 overflow-y-auto items-center justify-center">
      <SearchToolbar onQueryChange={handleQueryChange} />
      {query ? (
        <div className="flex-1 w-full">
          {students ? (
            students.map((student) => (
              <div className="bg-gray-50 py-2 px-4 w-full">
                <p>
                  {fullName(
                    student.firstName,
                    student.middleName ?? "",
                    student.lastName
                  )}
                </p>
              </div>
            ))
          ) : (
            <p>No Students</p>
          )}
          {students?.length}

        </div>
      ) : (
        <DetailsDisplay data={data} />
      )}
    </div>
  );
};

export default StudentDetails;
