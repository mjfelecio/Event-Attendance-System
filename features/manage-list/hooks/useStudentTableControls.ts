"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import type {
  StudentFilterState,
  StudentSortDirection,
  StudentSortField,
  StudentTableState,
} from "@/features/manage-list/types";

export const SORT_OPTIONS: { value: StudentSortField; label: string }[] = [
  { value: "updatedAt", label: "Date Modified" },
  { value: "lastName", label: "Alphabetical" },
  { value: "yearLevel", label: "Year Level" },
];

type QueryUpdates = Record<string, string | number | undefined>;

interface UseStudentTableControlsArgs {
  state: StudentTableState;
}

export const useStudentTableControls = ({
  state,
}: UseStudentTableControlsArgs) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(state.search);
  const previousCommittedSearch = useRef(state.search);
  const pendingParams = useRef(searchParams.toString());

  useEffect(() => {
    pendingParams.current = searchParams.toString();
  }, [searchParams]);

  const updateQuery = useCallback(
    (updates: QueryUpdates) => {
      // Build on the last requested URL, not only the last committed URL. This
      // prevents quick consecutive filter/sort changes from overwriting one
      // another while the previous server navigation is still in flight.
      const params = new URLSearchParams(pendingParams.current);

      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }

      const query = params.toString();
      pendingParams.current = query;
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      });
    },
    [pathname, router]
  );

  // Keep the input responsive while avoiding a server render for every
  // keystroke. The URL remains shareable and drives the authoritative query.
  useEffect(() => {
    const normalizedSearch = searchValue.trim();
    if (normalizedSearch === state.search) return;

    const timeout = window.setTimeout(() => {
      updateQuery({ q: normalizedSearch || undefined, page: undefined });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchValue, state.search, updateQuery]);

  // Back/forward navigation can change the committed URL independently of the
  // local input. Do not overwrite in-progress typing unless the URL changed.
  useEffect(() => {
    if (previousCommittedSearch.current !== state.search) {
      previousCommittedSearch.current = state.search;
      setSearchValue(state.search);
    }
  }, [state.search]);

  const setSortField = (field: StudentSortField) =>
    updateQuery({
      sort: field === "updatedAt" ? undefined : field,
      page: undefined,
    });

  const setSortDirection = (direction: StudentSortDirection) =>
    updateQuery({
      direction: direction === "desc" ? undefined : direction,
      page: undefined,
    });

  const resetSort = () =>
    updateQuery({ sort: undefined, direction: undefined, page: undefined });

  const updateFilter = (key: keyof StudentFilterState, value: string) => {
    const updates: QueryUpdates = {
      [key]: value === "all" ? undefined : value,
      page: undefined,
    };

    // Dependent filters must not survive a parent change with an impossible
    // value. The server still validates every value independently.
    if (key === "department") {
      updates.program = undefined;
      updates.section = undefined;
    } else if (key === "program") {
      updates.section = undefined;
    }

    updateQuery(updates);
  };

  const clearFilters = () =>
    updateQuery({
      department: undefined,
      program: undefined,
      house: undefined,
      section: undefined,
      level: undefined,
      page: undefined,
    });

  const setPage = (page: number) =>
    updateQuery({ page: page <= 1 ? undefined : page });

  const setPageSize = (pageSize: number) =>
    updateQuery({ pageSize: pageSize === 25 ? undefined : pageSize, page: undefined });

  return {
    searchValue,
    setSearchValue,
    sortField: state.sortField,
    setSortField,
    sortDirection: state.sortDirection,
    setSortDirection,
    resetSort,
    filters: state.filters,
    updateFilter,
    clearFilters,
    setPage,
    setPageSize,
    isPending,
  };
};

export type FilterState = StudentFilterState;
export type SortDirection = StudentSortDirection;
export type SortField = StudentSortField;
