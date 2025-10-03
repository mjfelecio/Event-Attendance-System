import { Flame, UserRound, UsersRound } from "lucide-react";
import { StudentStat } from "@/features/manage-list/types";

export const STUDENT_STATS: StudentStat[] = [
  {
    title: "College Students",
    icon: UserRound,
    align: "left",
    category: "college",
    value: 0,
  },
  {
    title: "SHS Students",
    icon: UsersRound,
    align: "right",
    category: "shs",
    value: 0,
  },
  {
    title: "All Students",
    icon: Flame,
    align: "left",
    category: "all",
    value: 0,
  },
  {
    title: "House Members",
    icon: Flame,
    align: "right",
    category: "house",
    value: 0,
  },
];
