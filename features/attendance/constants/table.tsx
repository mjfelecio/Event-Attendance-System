import { ColumnDef } from "@tanstack/react-table";
import { Student, StudentAttendanceRecord } from "@/globals/types/students";
import { Button } from "@/globals/components/shad-cn/button";
import { FaCheck, FaClock, FaTrash } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";

export const columns: ColumnDef<StudentAttendanceRecord>[] = [
  {
    accessorKey: "id",
    header: "Student ID",
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "schoolLevel",
    header: "School Level",
  },
  {
    accessorKey: "section",
    header: "Section",
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
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
      return timeStamp;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Student ID</div>,
    cell({ row }) {
      return (
        <div className="flex gap-1 items-center justify-center">
          <Button variant={"ghost"} size={"sm"} title="Present">
            <FaCheck color="oklch(72.3% 0.219 149.579)" />
          </Button>
          <Button variant={"ghost"} size={"sm"} title="Excuse">
            <FaClock color="oklch(82.8% 0.189 84.429)" />
          </Button>
          <Button variant={"ghost"} size={"sm"} title="Absent">
            <FaTimes color="red" />
          </Button>
          <Button variant={"ghost"} size={"sm"} title="Clear">
            <FaTrash color="gray" />
          </Button>
        </div>
      );
    },
  },
];
