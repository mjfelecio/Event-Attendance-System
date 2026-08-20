import { ColumnDef } from "@tanstack/react-table";
import { Student } from "@/globals/types/students";
import { formatSection, normalizeName } from "@/globals/utils/formatting";
import { Delete, Edit } from "lucide-react";

type ColumnArgs = {
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
};

export const getStudentColumns = ({
  onEdit,
  onDelete,
}: ColumnArgs): ColumnDef<Student>[] => [
  {
    accessorKey: "id",
    header: () => <div className="text-center">Student ID</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "lastName",
    header: () => <div className="text-center">Last Name</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "firstName",
    header: () => <div className="text-center">First Name</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "middleName",
    header: () => <div className="text-center">M.I.</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{(getValue() as string) || "-"}</div>
    ),
  },
  {
    accessorKey: "schoolLevel",
    header: () => <div className="text-center">Level</div>,
    cell: ({ getValue }) => (
      <div className="text-center uppercase">
        {normalizeName(getValue() as string) || "-"}
      </div>
    ),
  },
  {
    accessorKey: "yearLevel",
    header: () => <div className="text-center">Year / Grade</div>,
    cell: ({ getValue }) => (
      <div className="text-center uppercase">
        {normalizeName(getValue() as string) || "-"}
      </div>
    ),
    enableGlobalFilter: false,
  },
  {
    accessorKey: "department",
    header: () => <div className="text-center">Department</div>,
    cell: ({ getValue }) => (
      <div className="text-center">
        {normalizeName(getValue() as string) || "-"}
      </div>
    ),
  },
  {
    accessorKey: "program",
    header: () => <div className="text-center">Program</div>,
    cell: ({ getValue }) => (
      <div className="text-center uppercase">
        {(getValue() as string) || "-"}
      </div>
    ),
  },
  {
    accessorKey: "strand",
    header: () => <div className="text-center">Strand</div>,
    cell: ({ getValue }) => (
      <div className="text-center uppercase">{(getValue() as string) || "-"}</div>
    ),
  },
  {
    accessorKey: "house",
    header: () => <div className="text-center">House</div>,
    cell: ({ getValue }) => (
      <div className="text-center uppercase">
        {(getValue() as string) || "-"}
      </div>
    ),
  },
  {
    accessorKey: "section",
    header: () => <div className="text-center">Section</div>,
    cell: ({ getValue }) => (
      <div className="text-center">
        {formatSection(getValue() as string) || "-"}
      </div>
    ),
    enableGlobalFilter: false,
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center justify-center gap-2 md:gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-100 md:px-2 md:text-xs"
            onClick={() => onEdit(student)}
          >
            <Edit className="size-3.5" strokeWidth={1.6} />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-rose-50 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-rose-700 transition hover:border-rose-400 hover:bg-rose-100 md:px-2 md:text-xs"
            onClick={() => onDelete(student.id)}
          >
            <Delete className="size-3.5" strokeWidth={1.6} />
          </button>
        </div>
      );
    },
  },
];
