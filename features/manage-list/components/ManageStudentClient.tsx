"use client";

import { useMemo, useState } from "react";
import { ManageStudentContext } from "@/features/manage-list/types";
import StudentsDataTable from "./dataTable/StudentsDataTable";
import { getStudentColumns } from "./dataTable/studentTableColumn";
import { StudentWithGroups } from "@/globals/types/students";
import { toastSuccess } from "@/globals/components/shared/toasts";
import StudentFormDrawer from "./StudentFormDrawer";
import { StudentFormValues } from "@/globals/schemas/studentSchema";

interface ManageStudentClientProps {
  category: ManageStudentContext["category"];
  label?: string;
  item?: string;
  categoryHeading: string;
  students: StudentWithGroups[];
}

const ManageStudentClient = ({
  category,
  label,
  item,
  categoryHeading,
  students,
}: ManageStudentClientProps) => {
  const [formData, setFormData] = useState<StudentWithGroups | null>(null);
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);

  const handleEdit = () => {
    toastSuccess("Editing");
  };

  const handleDelete = () => {
    toastSuccess("Deleting");
  };

  const columns = useMemo(
    () =>
      getStudentColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [],
  );

  const handleSubmit = (data: StudentFormValues) => {
    toastSuccess("Submitted successfully!")
    console.table(data);
  }

  // const handleAddStudent = async (data: StudentFormData) => {
  //   setSubmitError(null);

  //   try {
  //     const response = await fetch("/api/students", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(normalizeFormData(data)),
  //     });

  //     if (!response.ok) {
  //       const payload = await response.json().catch(() => ({}));
  //       throw new Error(payload?.message ?? "Failed to add student");
  //     }

  //     const payload = (await response.json()) as { student: StudentRow };
  //     setStudentRows((prev) => [payload.student, ...prev]);
  //   } catch (error) {
  //     console.error("Error adding student", error);
  //     setSubmitError(
  //       error instanceof Error ? error.message : "Failed to add student",
  //     );
  //     throw error;
  //   }
  // };

  // const handleEditStudent = (student: StudentRow) => {
  //   setEditingStudent(student);
  //   setIsEditDialogOpen(true);
  // };

  // const handleUpdateStudent = async (data: StudentFormData) => {
  //   if (!editingStudent) return;

  //   setSubmitError(null);

  //   try {
  //     const response = await fetch(
  //       `/api/students/${editingStudent.studentNumber}`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(normalizeFormData(data)),
  //       },
  //     );

  //     if (!response.ok) {
  //       const payload = await response.json().catch(() => ({}));
  //       throw new Error(payload?.message ?? "Failed to update student");
  //     }

  //     const payload = (await response.json()) as { student: StudentRow };
  //     setStudentRows((prev) =>
  //       prev.map((row) =>
  //         row.studentNumber === payload.student.studentNumber
  //           ? payload.student
  //           : row,
  //       ),
  //     );
  //     setIsEditDialogOpen(false);
  //     setEditingStudent(null);
  //   } catch (error) {
  //     console.error("Error updating student", error);
  //     setSubmitError(
  //       error instanceof Error ? error.message : "Failed to update student",
  //     );
  //     throw error;
  //   }
  // };

  // const handleDeleteStudent = async (student: StudentRow) => {
  //   if (
  //     !window.confirm(
  //       `Delete student ${student.firstName} ${student.lastName}?`,
  //     )
  //   ) {
  //     return;
  //   }

  //   setSubmitError(null);

  //   try {
  //     const response = await fetch(`/api/students/${student.studentNumber}`, {
  //       method: "DELETE",
  //     });

  //     if (!response.ok) {
  //       const payload = await response.json().catch(() => ({}));
  //       throw new Error(payload?.message ?? "Failed to delete student");
  //     }

  //     setStudentRows((prev) =>
  //       prev.filter((row) => row.studentNumber !== student.studentNumber),
  //     );
  //   } catch (error) {
  //     console.error("Error deleting student", error);
  //     setSubmitError(
  //       error instanceof Error ? error.message : "Failed to delete student",
  //     );
  //   }
  // };

  return (
    <div className="flex w-full flex-col gap-6">
      <StudentsDataTable
        columns={columns}
        data={students ?? []}
        isLoading={false}
        categoryHeader={label ?? ""}
        categorySubheader={categoryHeading ?? ""}
        groupSlug={item ?? ""}
        onAddStudent={() => setIsStudentFormOpen(true)}
      />

      <StudentFormDrawer
        student={undefined}
        isOpen={isStudentFormOpen}
        onClose={() => setIsStudentFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ManageStudentClient;
