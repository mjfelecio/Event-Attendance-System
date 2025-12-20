import { AttendanceStatus } from "@prisma/client";
import { BiSolidTrash } from "react-icons/bi";
import { FaUserTimes } from "react-icons/fa";
import { FaTrash, FaUserCheck, FaUserClock } from "react-icons/fa6";
import { IconType } from "react-icons/lib";
import { LuUserRoundCheck, LuUserRoundX } from "react-icons/lu";
import { TbShieldCheck } from "react-icons/tb";

export const ATTENDANCE_STATUS_ICONS: Record<AttendanceStatus | "DELETE", IconType> = {
	PRESENT: LuUserRoundCheck,
	LATE: FaUserClock,
	EXCUSED: TbShieldCheck,
	ABSENT: LuUserRoundX,
	DELETE: BiSolidTrash
};