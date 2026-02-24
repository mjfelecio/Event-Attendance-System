import { AttendanceStatus } from "@/globals/types/records";
import { IconType } from "react-icons/lib";
import { LuUserRoundCheck, LuUserRoundX } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";

export const ATTENDANCE_STATUS_ICONS: Record<
  AttendanceStatus | "delete",
  IconType
> = {
  present: LuUserRoundCheck,
  absent: LuUserRoundX,
  delete: MdDeleteOutline,
};
