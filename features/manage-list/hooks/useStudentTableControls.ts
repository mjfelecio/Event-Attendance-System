'use client';

import { useEffect, useMemo, useState } from "react";
import { StudentRow } from "@/features/manage-list/types";

type SortField = "updatedAt" | "lastName" | "yearLevel";
type SortDirection = "asc" | "desc";

type FilterState = {
  department: string;
  program: string;
  house: string;
  section: string;
  level: string;
};

const YEAR_LEVEL_WEIGHT = (label: string | undefined) => {
  if (!label) return Number.MAX_SAFE_INTEGER;
  const normalized = label.toLowerCase();
  const numeric = parseInt(label.replace(/[^0-9]/g, ""), 10);

  if (Number.isNaN(numeric)) {
    return Number.MAX_SAFE_INTEGER - 1;
  }

  if (normalized.includes("grade")) {
    return 100 + numeric;
  }

  return numeric;
};

const uniqueSorted = (values: Array<string | undefined>) =>
  Array.from(new Set(values.filter((value): value is string => Boolean(value))))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

const defaultFilters: FilterState = {
  department: "all",
  program: "all",
  house: "all",
  section: "all",
  level: "all",
};

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "updatedAt", label: "Date Modified" },
  { value: "lastName", label: "Alphabetical" },
  { value: "yearLevel", label: "Year Level" },
];

interface UseStudentTableControlsArgs {
  rows: StudentRow[];
  resetKey?: string;
}

interface UseStudentTableControlsResult {
  searchValue: string;
  setSearchValue: (value: string) => void;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortDirection: SortDirection;
  setSortDirection: (direction: SortDirection) => void;
  resetSort: () => void;
  sortOptions: typeof SORT_OPTIONS;
  filters: FilterState;
  updateFilter: (key: keyof FilterState, value: string) => void;
  clearFilters: () => void;
  filterOptions: {
    departments: string[];
    programsByDepartment: Record<string, string[]>;
  };
  availablePrograms: string[];
  availableSections: string[];
  availableLevels: string[];
  availableHouses: string[];
  visibleRows: StudentRow[];
}

export const useStudentTableControls = ({
  rows,
  resetKey,
}: UseStudentTableControlsArgs): UseStudentTableControlsResult => {
  const [searchValue, setSearchValue] = useState("");
  const [sortField, setSortField] = useState<SortField>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filters, setFilters] = useState<FilterState>({ ...defaultFilters });

  useEffect(() => {
    setSearchValue("");
    setSortField("updatedAt");
    setSortDirection("desc");
    setFilters({ ...defaultFilters });
  }, [resetKey]);

  const filterOptions = useMemo(() => {
    const departments = uniqueSorted(rows.map((student) => student.department));
    const programsByDepartment: Record<string, string[]> = {};
    departments.forEach((department) => {
      programsByDepartment[department] = uniqueSorted(
        rows
          .filter((student) => student.department === department)
          .map((student) => student.program)
      );
    });

    return {
      departments,
      programsByDepartment,
    };
  }, [rows]);

  const availablePrograms = useMemo(() => {
    const subset =
      filters.department === "all"
        ? rows
        : rows.filter((student) => student.department === filters.department);

    if (filters.department === "all") {
      return uniqueSorted(subset.map((student) => student.program));
    }

    return uniqueSorted(subset.map((student) => student.program));
  }, [filters.department, rows]);

  const availableSections = useMemo(() => {
    const subset = rows.filter((student) => {
      if (filters.department !== "all" && student.department !== filters.department) {
        return false;
      }

      if (filters.program !== "all" && student.program !== filters.program) {
        return false;
      }

      return true;
    });

    return uniqueSorted(subset.map((student) => student.section));
  }, [filters.department, filters.program, rows]);

  const availableLevels = useMemo(() => {
    const subset = rows.filter((student) => {
      if (filters.department !== "all" && student.department !== filters.department) {
        return false;
      }

      if (filters.program !== "all" && student.program !== filters.program) {
        return false;
      }

      return true;
    });

    const levelWeights = new Map<string, number>();
    subset.forEach((student) => {
      const weight = YEAR_LEVEL_WEIGHT(student.yearLevelLabel);
      const existing = levelWeights.get(student.yearLevelLabel);
      if (existing === undefined || weight < existing) {
        levelWeights.set(student.yearLevelLabel, weight);
      }
    });

    return Array.from(levelWeights.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([label]) => label);
  }, [filters.department, filters.program, rows]);

  const availableHouses = useMemo(() => {
    const subset = rows.filter((student) => {
      if (student.schoolLevel !== "COLLEGE") {
        return false;
      }

      if (filters.department !== "all" && student.department !== filters.department) {
        return false;
      }

      if (filters.program !== "all" && student.program !== filters.program) {
        return false;
      }

      if (filters.level !== "all" && student.yearLevelLabel !== filters.level) {
        return false;
      }

      return true;
    });

    return uniqueSorted(subset.map((student) => student.house));
  }, [filters.department, filters.program, filters.level, rows]);

  useEffect(() => {
    if (filters.program !== "all" && !availablePrograms.includes(filters.program)) {
      setFilters((prev) => ({ ...prev, program: "all", section: "all" }));
    }
  }, [availablePrograms, filters.program]);

  useEffect(() => {
    if (filters.section !== "all" && !availableSections.includes(filters.section)) {
      setFilters((prev) => ({ ...prev, section: "all" }));
    }
  }, [availableSections, filters.section]);

  useEffect(() => {
    if (filters.level !== "all" && !availableLevels.includes(filters.level)) {
      setFilters((prev) => ({ ...prev, level: "all" }));
    }
  }, [availableLevels, filters.level]);

  useEffect(() => {
    if (filters.house !== "all" && !availableHouses.includes(filters.house)) {
      setFilters((prev) => ({ ...prev, house: "all" }));
    }
  }, [availableHouses, filters.house]);

  const visibleRows = useMemo(() => {
    const lowerSearch = searchValue.trim().toLowerCase();

    const filtered = rows.filter((student) => {
      if (filters.department !== "all") {
        if (student.department !== filters.department) {
          return false;
        }
      }

      if (filters.program !== "all" && student.program !== filters.program) {
        return false;
      }

      if (filters.house !== "all" && student.house !== filters.house) {
        return false;
      }

      if (filters.section !== "all" && student.section !== filters.section) {
        return false;
      }

      if (filters.level !== "all" && student.yearLevelLabel !== filters.level) {
        return false;
      }

      if (!lowerSearch) {
        return true;
      }

      const haystack = [
        student.studentNumber,
        student.lastName,
        student.firstName,
        student.middleName,
        student.program,
        student.department,
        student.house,
        student.section,
        student.yearLevelLabel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(lowerSearch);
    });

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      if (sortField === "updatedAt") {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else if (sortField === "lastName") {
        comparison = a.lastName.localeCompare(b.lastName);
        if (comparison === 0) {
          comparison = a.firstName.localeCompare(b.firstName);
        }
      } else if (sortField === "yearLevel") {
        comparison = YEAR_LEVEL_WEIGHT(a.yearLevelLabel) - YEAR_LEVEL_WEIGHT(b.yearLevelLabel);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [filters, rows, searchValue, sortDirection, sortField]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ ...defaultFilters });
  };

  const resetSort = () => {
    setSortField("updatedAt");
    setSortDirection("desc");
  };

  return {
    searchValue,
    setSearchValue,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    resetSort,
    sortOptions: SORT_OPTIONS,
    filters,
    updateFilter,
    clearFilters,
    filterOptions,
    availablePrograms,
    availableSections,
    availableLevels,
    availableHouses,
    visibleRows,
  };
};

export type { FilterState, SortDirection, SortField };
export { SORT_OPTIONS };
