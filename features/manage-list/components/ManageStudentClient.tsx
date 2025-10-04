'use client';

import { useState } from "react";
import StudentTable from "@/features/manage-list/components/StudentTable";
import StudentManageToolbar from "@/features/manage-list/components/StudentManageToolbar";
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
  } = useStudentTableControls({ rows });

  return (
    <div className="flex w-full flex-col gap-6">
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
      />

      <StudentTable rows={visibleRows} />
    </div>
  );
};

export default ManageStudentClient;
