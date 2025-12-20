import { AttendanceStatus } from "@prisma/client";
import { ATTENDANCE_STATUS_ICONS } from "../constants/attendanceStatus";
import { capitalize } from "lodash";

type Props = {
  status: AttendanceStatus;
};

const statusStyles: Record<AttendanceStatus, string> = {
  PRESENT: "bg-emerald-50 border-emerald-100",
  LATE: "bg-amber-50 border-amber-100",
  EXCUSED: "bg-sky-50 border-sky-100",
  ABSENT: "bg-rose-50 border-rose-100",
};

const iconContainerStyles: Record<AttendanceStatus, string> = {
  PRESENT: "border-emerald-400 text-emerald-600",
  LATE: "border-amber-400 text-amber-600",
  EXCUSED: "border-sky-400 text-sky-600",
  ABSENT: "border-rose-400 text-rose-600",
};

const iconStyles: Record<AttendanceStatus, string> = {
  PRESENT: "translate-x-0.5",
  LATE: "translate-x-0.5",
  EXCUSED: "",
  ABSENT: "translate-x-0.5",
};

const AttendanceStatusCard = ({ status }: Props) => {
  const Icon = ATTENDANCE_STATUS_ICONS[status];
  const containerStyle = statusStyles[status];
  const iconContainerStyle = iconContainerStyles[status];
  const iconStyle = iconStyles[status];
  const statusText = capitalize(status); // Capitalize

  return (
    <div
      className={`h-28 w-24 p-3 flex flex-col items-center justify-between rounded-2xl border-3 ${containerStyle}`}
    >
      <div
        className={`rounded-full size-14 border-3 flex items-center justify-center ${iconContainerStyle}`}
      >
        <Icon className={`size-7 ${iconStyle}`} />
      </div>
      <p className="text-xs font-bold tracking-wide text-gray-600 uppercase">
        {statusText}
      </p>
    </div>
  );
};

export default AttendanceStatusCard;
