import { FaUser } from "react-icons/fa";
import { Student } from "@/globals/types/students";

type Props = {
  data: Student | undefined;
};

const StudentDetails = ({ data }: Props) => {
  if (!data) {
    return (
      <div className="flex-1 flex rounded-md bg-white border-2 p-6 overflow-y-auto items-center justify-center">
        <p className="text-gray-500 flex items-center gap-2 text-3xl">
          <FaUser className="text-gray-400" />
          No Student Found
        </p>
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
    <div className="flex-1 rounded-md bg-white border-2 p-6 overflow-y-auto">
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
    </div>
  );
};

export default StudentDetails;
