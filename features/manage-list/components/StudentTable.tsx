"use client";

import { useMemo } from "react";
import type { SortingState } from "@tanstack/react-table";

import DataTable from "@/globals/components/shared/dataTable/DataTable";
import { DataTableEmptyState } from "@/globals/components/shared/dataTable/DataTableStates";
import { getStudentColumns } from "@/features/manage-list/constants/studentTableColumns";
import type {
  StudentPagination,
  StudentRow,
  StudentSortDirection,
  StudentSortField,
} from "@/features/manage-list/types";

interface StudentTableProps {
  rows: StudentRow[];
  pagination: StudentPagination;
  sortField: StudentSortField;
  sortDirection: StudentSortDirection;
  activeFilterCount?: number;
  isSearching?: boolean;
  isPending?: boolean;
  /** Requests a 1-based server page. */
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (
    field: StudentSortField,
    direction: StudentSortDirection
  ) => void;
  onEditStudent?: (student: StudentRow) => void;
  onDeleteStudent?: (student: StudentRow) => void;
}

/**
 * StudentTable
 *
 * A thin adapter over the shared DataTable. It owns nothing but student-specific
 * columns and the translation between the server-driven table controls
 * (1-based page, URL sort field/direction) and the shared table's controlled
 * ("manual") contract. All table markup, pagination, loading, and empty-state
 * rendering lives in the shared DataTable so this table matches Attendance.
 */
const StudentTable = ({
  rows,
  pagination,
  sortField,
  sortDirection,
  activeFilterCount = 0,
  isSearching = false,
  isPending = false,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onEditStudent,
  onDeleteStudent,
}: StudentTableProps) => {
  const columns = useMemo(
    () => getStudentColumns({ onEditStudent, onDeleteStudent }),
    [onEditStudent, onDeleteStudent]
  );

  // "Date Modified" (updatedAt) is a Sort-popover option with no column of its
  // own, so no header shows as active for it; the two header-sortable columns
  // reflect their exact server field/direction.
  const sorting: SortingState = useMemo(
    () =>
      sortField === "updatedAt"
        ? []
        : [{ id: sortField, desc: sortDirection === "desc" }],
    [sortField, sortDirection]
  );

  const handleSortingChange = (next: SortingState) => {
    const first = next[0];
    if (!first) {
      // Sort removed -> fall back to the default (most recently modified first).
      onSortChange("updatedAt", "desc");
      return;
    }
    onSortChange(
      first.id as StudentSortField,
      first.desc ? "desc" : "asc"
    );
  };

  const isFiltered = activeFilterCount > 0 || isSearching;

  return (
    <div className="px-6 md:px-12">
      <DataTable
        columns={columns}
        data={rows}
        isLoading={false}
        showToolbar={false}
        getRowId={(row) => row.studentNumber}
        emptyState={
          <DataTableEmptyState
            title="No students found"
            description="No students found for this selection."
          />
        }
        filteredEmptyState={
          <DataTableEmptyState
            title="No matching students"
            description="No students match the current search and filters."
          />
        }
        manual={{
          pageIndex: pagination.page - 1,
          pageSize: pagination.pageSize,
          rowCount: pagination.totalRows,
          onPageChange: (pageIndex) => onPageChange(pageIndex + 1),
          onPageSizeChange,
          sorting,
          onSortingChange: handleSortingChange,
          isPending,
          isFiltered,
        }}
      />
    </div>
  );
};

export default StudentTable;
