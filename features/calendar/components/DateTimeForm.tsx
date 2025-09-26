import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/globals/components/shad-cn/collapsible";
import { useState } from "react";
import DatePicker from "@/features/calendar/components/DatePicker";
import TimeSelector from "@/features/calendar/components/TimeSelector";
import { format } from "date-fns";

type Props = {
  label: string;
  date: Date;
  onDateTimeChange: (date: Date) => void;
  allDay: boolean;
};

type Time = {
  hour: number;
  minute: number;
  second: number;
  period: "AM" | "PM";
};

/**
 * Helper to combine date and time into a single Date object
 */
function buildDateTime(date: Date, time: Time, allDay: boolean): Date {
  if (allDay)
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );

  const hour =
    time.period === "PM" && time.hour !== 12
      ? time.hour + 12
      : time.period === "AM" && time.hour === 12
      ? 0
      : time.hour;

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hour,
    time.minute,
    time.second
  );
}

const DateTimeForm = ({
  label,
  date: initialDate,
  onDateTimeChange,
  allDay,
}: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [selectedTime, setSelectedTime] = useState<Time>({
    hour: initialDate.getHours() % 12 || 12,
    minute: initialDate.getMinutes(),
    second: initialDate.getSeconds(),
    period: initialDate.getHours() >= 12 ? "PM" : "AM",
  });

  const fullDateTime = buildDateTime(selectedDate, selectedTime, allDay);
  const formattedDateTime = format(fullDateTime, "EEE, MMM d, yyyy h:mm a");
  const formattedDate = format(fullDateTime, "EEE, MMM d, yyyy");

  return (
    <Collapsible className="border border-black rounded-lg overflow-hidden">
      <CollapsibleTrigger asChild>
        <div className="flex justify-between items-center hover:bg-gray-100 p-2 overflow-hidden">
          <p>{label}</p>
          <p>{allDay ? formattedDate : formattedDateTime}</p>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent asChild>
        <div className="border-t border-t-black h-24 py-2 px-6 justify-between items-center flex gap-2">
          <DatePicker
            date={fullDateTime}
            onChange={(date) => {
              setSelectedDate(date);
              onDateTimeChange(buildDateTime(date, selectedTime, allDay));
            }}
          />
          <TimeSelector
            time={selectedTime}
            onChange={(time) => {
              setSelectedTime(time);
              onDateTimeChange(buildDateTime(selectedDate, time, allDay));
            }}
            disabled={allDay}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DateTimeForm;
