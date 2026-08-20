import { LucideIcon } from "lucide-react";

export type StudentListCategory = "ALL" | "COLLEGE" | "SHS" | "HOUSE";

export type StudentStat = {
  title: string;
  icon?: LucideIcon;
  logo?: string;
  align: "left" | "right";
  value?: number | null;
  category: StudentListCategory;
};

export type StudentSortField = "updatedAt" | "lastName" | "yearLevel";
export type StudentSortDirection = "asc" | "desc";

export type StudentFilterState = {
  department: string;
  program: string;
  house: string;
  section: string;
  level: string;
};

export type StudentTableState = {
  search: string;
  sortField: StudentSortField;
  sortDirection: StudentSortDirection;
  filters: StudentFilterState;
};

export type StudentFilterOptions = {
  departments: string[];
  programs: string[];
  sections: string[];
  levels: string[];
  houses: string[];
};

export type StudentPagination = {
  page: number;
  pageSize: number;
  totalRows: number;
  selectionTotal: number;
  totalPages: number;
};
