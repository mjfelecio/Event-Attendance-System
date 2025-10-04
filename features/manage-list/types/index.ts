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
};
