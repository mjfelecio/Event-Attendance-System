'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import StudentTable from "@/features/manage-list/components/StudentTable";
import StudentManageToolbar from "@/features/manage-list/components/StudentManageToolbar";
import AddStudentDialog from "@/features/manage-list/components/AddStudentDialog";
import { StudentFormData } from "@/features/manage-list/types/add-dialog/AddStudentDialog.types";
import { useStudentTableControls } from "@/features/manage-list/hooks/useStudentTableControls";
import type {
  StudentFilterOptions,
  StudentPagination,
  StudentRow,
  StudentTableState,
} from "@/features/manage-list/types";
import { fetchApi } from "@/globals/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/globals/utils/queryKeys";

interface ManageStudentClientProps {
  label?: string;
  item?: string;
  categoryHeading: string;
  rows: StudentRow[];
  tableState: StudentTableState;
  filterOptions: StudentFilterOptions;
  pagination: StudentPagination;
}

const ManageStudentClient = ({
  label,
  item,
  categoryHeading,
  rows,
  tableState,
  filterOptions,
  pagination,
}: ManageStudentClientProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // ["students"] with default prefix matching invalidates every student query
  // (all, stats, sections, byId, fromEvent, ...) so the stat board, event
  // drawer, and attendance searches never disagree with the table.
  const invalidateStudents = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.students.all() });
  };

  // Refresh both the server-rendered table AND the React Query student caches.
  const refreshStudents = () => {
    router.refresh();
    invalidateStudents();
  };

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRow | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    searchValue,
    setSearchValue,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    setSort,
    resetSort,
    filters,
    updateFilter,
    clearFilters,
    setPage,
    setPageSize,
    isPending,
  } = useStudentTableControls({
    state: tableState,
  });

  const visibleRowsCount = rows.length;
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
      await fetchApi<{ student: StudentRow }>("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(normalizeFormData(data)),
      });

      refreshStudents();
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
      await fetchApi<{ student: StudentRow }>(
        `/api/students/${editingStudent.studentNumber}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(normalizeFormData(data)),
        }
      );

      setIsEditDialogOpen(false);
      setEditingStudent(null);
      refreshStudents();
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
      await fetchApi<null>(`/api/students/${student.studentNumber}`, {
        method: "DELETE",
      });

      // The React Query student caches (stats/sections/event-students) must be
      // invalidated on every delete - including when we shift to the previous
      // page (setPage re-renders the server table but doesn't touch them).
      invalidateStudents();
      if (rows.length === 1 && pagination.page > 1) {
        setPage(pagination.page - 1);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting student", error);
      setSubmitError(error instanceof Error ? error.message : "Failed to delete student");
    }
  };

  // Import is not implemented yet; the toolbar button is disabled. Kept as a
  // no-op so the prop contract stays intact until the import feature lands.
  const handleImportStudents = () => {};

  return (
    <div className="flex w-full flex-col gap-6">
      {submitError && (
        <div className="mx-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm md:mx-12">
          {submitError}
        </div>
      )}
      <StudentTable
        rows={rows}
        pagination={pagination}
        sortField={sortField}
        sortDirection={sortDirection}
        activeFilterCount={activeFilterCount}
        isSearching={isSearching}
        isPending={isPending}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSortChange={setSort}
        onEditStudent={handleEditStudent}
        onDeleteStudent={handleDeleteStudent}
        toolbar={
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
            programs={filterOptions.programs}
            sections={filterOptions.sections}
            levels={filterOptions.levels}
            houses={filterOptions.houses}
            isSortOpen={isSortOpen}
            setIsSortOpen={setIsSortOpen}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            onAddStudent={() => setIsAddDialogOpen(true)}
            onImportStudents={handleImportStudents}
            totalRows={pagination.selectionTotal}
            matchingRows={pagination.totalRows}
            visibleRowsCount={visibleRowsCount}
            activeFilterCount={activeFilterCount}
            isSearching={isSearching}
          />
        }
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
