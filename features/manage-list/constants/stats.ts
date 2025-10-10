import { Flame } from "lucide-react";
import { StudentStat } from "@/features/manage-list/types";

export const STUDENT_STATS: StudentStat[] = [
  {
    title: "College Students",
    logo: "/logos/school/Logo_College_Department.png",
    align: "left",
    category: "college",
    value: 0,
  },
  {
    title: "SHS Students",
    logo: "/logos/school/aclc.png",
    align: "right",
    category: "shs",
    value: 0,
  },
  {
    title: "All Students",
    logo: "/logos/school/logo.png",
    align: "left",
    category: "all",
    value: 0,
  },
  {
    title: "House Members",
    logo: "/logos/school/cup.png",
    align: "right",
    category: "house",
    value: 0,
  },
];
