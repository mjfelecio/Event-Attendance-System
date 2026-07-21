import { YearLevel } from "@prisma/client";
import { LucideIcon } from "lucide-react";

export type ManageListCategory = "ALL" | "COLLEGE" | "SHS" | "HOUSE";

export type StudentStat = {
  title: string;
  icon?: LucideIcon;
  logo?: string;
  align: "left" | "right";
  value?: number | null;
  category: ManageListCategory;
};

export type ManageStudentContext = {
  category: ManageListCategory;
  item?: string;
  label?: string;
  q?: string;
  page?: string;
  pageSize?: string;
  sort?: string;
  direction?: string;
  department?: string;
  program?: string;
  house?: string;
  section?: string;
  level?: string;
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

export type StudentRow = {
  studentNumber: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  program?: string;
  programSlug?: string;
  collegeProgram?: string;
  shsStrand?: string;
  department?: string;
  departmentSlug?: string;
  house?: string;
  houseSlug?: string;
  section: string;
  yearLevelLabel: string;
  yearLevel: YearLevel;
  schoolLevel: "COLLEGE" | "SHS";
  status: "ACTIVE" | "INACTIVE" | "GRADUATED" | "DROPPED";
  updatedAt: string;
};
