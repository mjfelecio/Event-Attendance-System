import { LucideIcon } from "lucide-react";

export type ManageListCategory = "all" | "college" | "shs" | "house";

export type StudentStat = {
  title: string;
  icon: LucideIcon;
  align: "left" | "right";
  value: number;
  category: ManageListCategory;
};

export type ManageStudentContext = {
  category: ManageListCategory;
  item?: string;
  label?: string;
  search?: string;
};

export type StudentRow = {
  studentNumber: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  program?: string;
  programSlug?: string;
  department?: string;
  departmentSlug?: string;
  house?: string;
  houseSlug?: string;
  section: string;
  yearLevelLabel: string;
  schoolLevel: "COLLEGE" | "SHS";
  status: "ACTIVE" | "INACTIVE" | "GRADUATED" | "DROPPED";
  contactNumber?: string;
  updatedAt: string;
};
