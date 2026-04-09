"use client";

import { useCallback, useMemo, useState } from "react";
import { ManageStudentContext } from "@/features/manage-list/types";
import StudentsDataTable from "./StudentsDataTable";
import { getStudentColumns } from "./StudentsDataTable/studentTableColumn";
import { StudentWithGroups } from "@/globals/types/students";
import { toastDanger, toastSuccess } from "@/globals/components/shared/toasts";
import StudentFormDrawer from "./StudentFormDrawer";
import { StudentFormValues } from "@/globals/schemas/studentSchema";
import { useDeleteStudent, useSaveStudent } from "@/globals/hooks/useStudents";
import { useConfirm } from "@/globals/contexts/ConfirmModalContext";

interface ManageStudentClientProps {
  category: ManageStudentContext["category"];
  label?: string;
  item?: string;
  categoryHeading: string;
  students: StudentWithGroups[];
  isLoading: boolean;
}

const ManageStudentClient = ({
  category,
  label,
  item,
  categoryHeading,
  students,
  isLoading
}: ManageStudentClientProps) => {
  const [formData, setFormData] = useState<StudentWithGroups>();
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);

  const { mutateAsync: saveStudent } = useSaveStudent();
  const { mutateAsync: deleteStudent } = useDeleteStudent();
  const confirm = useConfirm();

  const handleEdit = useCallback((data: StudentWithGroups) => {
    setFormData(data);
    setIsStudentFormOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setFormData(undefined);
    setIsStudentFormOpen(true);
  }, []);

  const handleDelete = useCallback(async (studentId: string) => {
    if (!studentId) return;

    const confirmed = await confirm({
      title: "Delete this student?",
      description:
        "All data from this student will be removed. This is an irreversable action.",
    });

    if (!confirmed) return;

    try {
      await deleteStudent(studentId);
      toastSuccess("Student deleted");
    } catch (error) {
      toastDanger(`Failed to delete: ${studentId}`);
    }
  }, []);

  const handleSubmit = useCallback(async (data: StudentFormValues) => {
    try {
      const student = await saveStudent(data);

      if (!student) {
        toastDanger("Failed to add student");
      }

      toastSuccess("Student saved.");
    } catch (error) {
      console.error("Error adding student", error);
      toastDanger("Failed saving student.");
      throw error;
    }
  }, []);

  const columns = useMemo(
    () =>
      getStudentColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [],
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <StudentsDataTable
        columns={columns}
        data={students ?? []}
        isLoading={isLoading}
        categoryHeader={label ?? ""}
        categorySubheader={categoryHeading ?? ""}
        groupSlug={item ?? ""}
        onAddStudent={handleAdd}
      />

      <StudentFormDrawer
        key={formData?.id}
        student={formData}
        isOpen={isStudentFormOpen}
        onClose={() => setIsStudentFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ManageStudentClient;
