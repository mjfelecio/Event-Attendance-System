import { AttendanceStatus } from "@prisma/client";
import { FaUserClock } from "react-icons/fa6";
import { IconType } from "react-icons/lib";
import { LuUserRoundCheck, LuUserRoundX } from "react-icons/lu";
import { TbShieldCheck } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";

export const ATTENDANCE_STATUS_ICONS: Record<
  AttendanceStatus | "DELETE",
  IconType
> = {
  PRESENT: LuUserRoundCheck,
  LATE: FaUserClock,
  EXCUSED: TbShieldCheck,
  ABSENT: LuUserRoundX,
  DELETE: MdDeleteOutline,
};
