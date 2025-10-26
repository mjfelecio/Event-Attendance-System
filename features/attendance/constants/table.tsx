import { ColumnDef } from "@tanstack/react-table";
import { Student, StudentAttendanceRecord } from "@/globals/types/students";
import { Button } from "@/globals/components/shad-cn/button";
import { FaCheck, FaClock, FaTrash } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { toast } from "sonner";

export const columns: ColumnDef<StudentAttendanceRecord>[] = [
  {
    accessorKey: "studentId",
    header: () => <div className="text-center">Student ID</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "fullName",
    header: () => <div className="text-center">Full Name</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "schoolLevel",
    header: () => <div className="text-center">School Level</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "section",
    header: () => <div className="text-center">Section</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "timestamp",
    header: () => <div className="text-center">Timestamp</div>,
    accessorFn: (row) => {
      return new Date(row.timestamp).toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    },
    cell: ({ getValue }) => {
      const timeStamp = getValue() as string;
      return <div className="text-center">{timeStamp}</div>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Student ID</div>,
    cell({ row }) {
      const studentId = row.original.studentId;

      return (
        <div className="flex gap-1 items-center justify-center">
          <Button
            onClick={() => handleActions("present", studentId)}
            variant={"ghost"}
            size={"sm"}
            title="Present"
          >
            <FaCheck color="oklch(72.3% 0.219 149.579)" />
          </Button>
          <Button
            onClick={() => handleActions("excuse", studentId)}
            variant={"ghost"}
            size={"sm"}
            title="Excuse"
          >
            <FaClock color="oklch(82.8% 0.189 84.429)" />
          </Button>
          <Button
            onClick={() => handleActions("absent", studentId)}
            variant={"ghost"}
            size={"sm"}
            title="Absent"
          >
            <FaTimes color="red" />
          </Button>
          <Button
            onClick={() => handleActions("clear", studentId)}
            variant={"ghost"}
            size={"sm"}
            title="Clear"
          >
            <FaTrash color="gray" />
          </Button>
        </div>
      );
    },
  },
];

function handleActions(
  type: "present" | "excuse" | "absent" | "clear",
  studentId: string
) {
  toast.success(
    <p>
      {type}d: {studentId}
    </p>,
    {
      position: "top-right",
    }
  );
}
