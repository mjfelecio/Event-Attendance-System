'use client';

import { useEffect, useState } from "react";
import StudentTable from "@/features/manage-list/components/StudentTable";
import StudentManageToolbar from "@/features/manage-list/components/StudentManageToolbar";
import AddStudentDialog from "@/features/manage-list/components/AddStudentDialog";
import { StudentFormData } from "@/features/manage-list/types/add-dialog/AddStudentDialog.types";
import { useStudentTableControls } from "@/features/manage-list/hooks/useStudentTableControls";
import { ManageStudentContext, StudentRow } from "@/features/manage-list/types";

interface ManageStudentClientProps {
  category: ManageStudentContext["category"];
  label?: string;
  item?: string;
  categoryHeading: string;
  rows: StudentRow[];
}

const ManageStudentClient = ({
  category: _category,
  label,
  item,
  categoryHeading,
  rows,
}: ManageStudentClientProps) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRow | null>(null);
  const [studentRows, setStudentRows] = useState(rows);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setStudentRows(rows);
  }, [rows]);

  const {
    searchValue,
    setSearchValue,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    resetSort,
    filters,
    updateFilter,
    clearFilters,
    filterOptions,
    availablePrograms,
    availableSections,
    availableLevels,
    availableHouses,
    visibleRows,
  } = useStudentTableControls({ rows: studentRows });

  const totalRows = studentRows.length;
  const visibleRowsCount = visibleRows.length;
  const activeFilterCount = Object.values(filters).filter((value) => value !== "all").length;
  const isSearching = searchValue.trim().length > 0;

  const normalizeFormData = (data: StudentFormData) => ({
    id: data.id,
    lastName: data.lastName.trim(),
    firstName: data.firstName.trim(),
    middleName: data.middleName === "N/A" ? null : data.middleName.trim(),
    schoolLevel: data.schoolLevel,
    shsStrand:
      data.schoolLevel === "SHS"
        ? data.shsStrand && data.shsStrand !== "N/A"
          ? data.shsStrand.trim()
          : null
        : null,
    collegeProgram:
      data.schoolLevel === "COLLEGE"
        ? data.collegeProgram && data.collegeProgram !== "N/A"
          ? data.collegeProgram.trim()
          : null
        : null,
    department:
      data.schoolLevel === "COLLEGE" && data.department.trim()
        ? data.department.trim()
        : null,
    house: data.house.trim() ? data.house.trim() : null,
    section: data.section.trim(),
    yearLevel: data.yearLevel,
    status: data.status,
    contactNumber: data.contactNumber.trim(),
  });

  const handleAddStudent = async (data: StudentFormData) => {
    setSubmitError(null);

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(normalizeFormData(data)),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.message ?? "Failed to add student");
      }

      const payload = (await response.json()) as { student: StudentRow };
      setStudentRows((prev) => [payload.student, ...prev]);
    } catch (error) {
      console.error("Error adding student", error);
      setSubmitError(error instanceof Error ? error.message : "Failed to add student");
      throw error;
    }
  };

  const handleEditStudent = (student: StudentRow) => {
    setEditingStudent(student);
    setIsEditDialogOpen(true);
  };

  const handleUpdateStudent = async (data: StudentFormData) => {
    if (!editingStudent) return;

    setSubmitError(null);

    try {
      const response = await fetch(`/api/students/${editingStudent.studentNumber}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(normalizeFormData(data)),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.message ?? "Failed to update student");
      }

      const payload = (await response.json()) as { student: StudentRow };
      setStudentRows((prev) =>
        prev.map((row) =>
          row.studentNumber === payload.student.studentNumber ? payload.student : row
        )
      );
      setIsEditDialogOpen(false);
      setEditingStudent(null);
    } catch (error) {
      console.error("Error updating student", error);
      setSubmitError(error instanceof Error ? error.message : "Failed to update student");
      throw error;
    }
  };

  const handleDeleteStudent = async (student: StudentRow) => {
    if (!window.confirm(`Delete student ${student.firstName} ${student.lastName}?`)) {
      return;
    }

    setSubmitError(null);

    try {
      const response = await fetch(`/api/students/${student.studentNumber}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.message ?? "Failed to delete student");
      }

      setStudentRows((prev) => prev.filter((row) => row.studentNumber !== student.studentNumber));
    } catch (error) {
      console.error("Error deleting student", error);
      setSubmitError(error instanceof Error ? error.message : "Failed to delete student");
    }
  };

  const handleImportStudents = () => {
    console.log('Import students clicked');
    // TODO: Implement import functionality
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {submitError && (
        <div className="mx-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm md:mx-12">
          {submitError}
        </div>
      )}
      <StudentManageToolbar
        categoryHeading={categoryHeading}
        label={label}
        item={item}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        resetSort={resetSort}
        filters={filters}
        updateFilter={updateFilter}
        clearFilters={clearFilters}
        departments={filterOptions.departments}
        programs={availablePrograms}
        sections={availableSections}
        levels={availableLevels}
        houses={availableHouses}
        isSortOpen={isSortOpen}
        setIsSortOpen={setIsSortOpen}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        onAddStudent={() => setIsAddDialogOpen(true)}
        onImportStudents={handleImportStudents}
        totalRows={totalRows}
        visibleRowsCount={visibleRowsCount}
        activeFilterCount={activeFilterCount}
        isSearching={isSearching}
      />

      <StudentTable
        rows={visibleRows}
        totalRows={totalRows}
        activeFilterCount={activeFilterCount}
        isSearching={isSearching}
        onEditStudent={handleEditStudent}
        onDeleteStudent={handleDeleteStudent}
      />

      <AddStudentDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddStudent}
      />

      <AddStudentDialog
        open={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleUpdateStudent}
        initialData={
          editingStudent
            ? {
                id: editingStudent.studentNumber,
                lastName: editingStudent.lastName,
                firstName: editingStudent.firstName,
                middleName: editingStudent.middleName ?? "",
                schoolLevel: editingStudent.schoolLevel,
                shsStrand: editingStudent.shsStrand ?? "",
                collegeProgram: editingStudent.collegeProgram ?? "",
                department: editingStudent.department ?? "",
                house: editingStudent.house ?? "",
                section: editingStudent.section,
                yearLevel: editingStudent.yearLevel,
                status: editingStudent.status,
                contactNumber: editingStudent.contactNumber ?? "",
              }
            : undefined
        }
        mode="edit"
        title="Edit Student"
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default ManageStudentClient;
