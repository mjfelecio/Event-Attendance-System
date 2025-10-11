"use client";

import { Delete, Edit } from "lucide-react";
import { StudentRow } from "@/features/manage-list/types";

type StudentRowActionsProps = {
  student: StudentRow;
  onEdit?: (student: StudentRow) => void;
  onDelete?: (student: StudentRow) => void;
};

const StudentRowActions = ({ student, onEdit, onDelete }: StudentRowActionsProps) => {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-3">
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full border border-emerald-500 bg-white px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-emerald-600 transition hover:bg-emerald-50 md:px-4 md:text-xs"
        onClick={() => onEdit?.(student)}
      >
        <Edit className="size-3.5" strokeWidth={1.6} />
        Edit
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full border border-rose-500 bg-white px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-rose-600 transition hover:bg-rose-50 md:px-4 md:text-xs"
        onClick={() => onDelete?.(student)}
      >
        <Delete className="size-3.5" strokeWidth={1.6} />
        Delete
      </button>
    </div>
  );
};

export default StudentRowActions;
