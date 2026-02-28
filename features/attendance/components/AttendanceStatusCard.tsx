import { AttendanceStatus } from "@/globals/types/records";
import { ATTENDANCE_STATUS_ICONS } from "@/features/attendance/constants/attendanceStatus";
import { capitalize } from "lodash";

type Props = {
  status: AttendanceStatus;
};

const statusStyles: Record<AttendanceStatus, string> = {
  present: "bg-emerald-50 border-emerald-100",
  absent: "bg-rose-50 border-rose-100",
};

const iconContainerStyles: Record<AttendanceStatus, string> = {
  present: "border-emerald-400 text-emerald-600",
  absent: "border-rose-400 text-rose-600",
};

const iconStyles: Record<AttendanceStatus, string> = {
  present: "translate-x-0.5",
  absent: "translate-x-0.5",
};

const AttendanceStatusCard = ({ status }: Props) => {
  const Icon = ATTENDANCE_STATUS_ICONS[status];
  const containerStyle = statusStyles[status];
  const iconContainerStyle = iconContainerStyles[status];
  const iconStyle = iconStyles[status];
  const statusText = capitalize(status);

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
