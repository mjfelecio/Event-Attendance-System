"use client";

import { useCallback, useMemo, useState } from "react";
import { ManageStudentContext } from "@/features/manage-list/types";
import StudentsDataTable from "./dataTable/StudentsDataTable";
import { getStudentColumns } from "./dataTable/studentTableColumn";
import { StudentWithGroups } from "@/globals/types/students";
import { toastDanger, toastSuccess } from "@/globals/components/shared/toasts";
import StudentFormDrawer from "./StudentFormDrawer";
import { StudentFormValues } from "@/globals/schemas/studentSchema";
import { useSaveStudent } from "@/globals/hooks/useStudents";

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
  const [formData, setFormData] = useState<StudentWithGroups>();
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);

  const { mutateAsync } = useSaveStudent();

  const handleEdit = useCallback((data: StudentWithGroups) => {
    setFormData(data);
    setIsStudentFormOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setFormData(undefined);
    setIsStudentFormOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    toastSuccess("Deleting");
  }, []);

  const handleSubmit = useCallback(async (data: StudentFormValues) => {
    try {
      const student = await mutateAsync(data);

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
        isLoading={false}
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
