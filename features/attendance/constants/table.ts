import { ColumnDef } from "@tanstack/react-table";
import { Student } from "@/globals/types/students";

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "id",
    header: "Student ID",
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
    accessorFn: (row) => {
      // Construct full name, handling optional middle name
      const middleInitial = row.middleName
        ? `${row.middleName.charAt(0)}.`
        : "";

      return `${row.firstName} ${middleInitial} ${row.lastName}`.trim();
    },
    cell: ({ getValue }) => {
      const fullName = getValue() as string;
      return fullName;
    },
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
  },
  {
		id: "actions",
    header: "Actions",
  },
];
