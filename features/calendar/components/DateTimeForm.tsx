import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/globals/components/shad-cn/collapsible";
import React, { useEffect, useState } from "react";
import DatePicker from "@/features/calendar/components/DatePicker";
import TimeSelector from "@/features/calendar/components/TimeSelector";
import { format } from "date-fns";

type Props = {
  label: string;
  date: Date;
  onDateTimeChange: (date: Date) => void;
};

const DateTimeForm = ({
  label,
  date: initialDate,
  onDateTimeChange,
}: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [selectedTime, setSelectedTime] = useState<{
    hour: number;
    minute: number;
    second: number;
    period: "AM" | "PM";
  }>({
    hour: new Date().getHours() % 12 || 12,
    minute: new Date().getMinutes(),
    second: new Date().getSeconds(),
    period: new Date().getHours() >= 12 ? "PM" : "AM",
  });

  const fullDateTime = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    selectedTime.period === "PM" && selectedTime.hour !== 12
      ? selectedTime.hour + 12
      : selectedTime.period === "AM" && selectedTime.hour === 12
      ? 0
      : selectedTime.hour,
    selectedTime.minute
  );

  const formattedDateTime = format(fullDateTime, "EEE, MMM d, yyyy h:mm a");

  useEffect(() => {
    onDateTimeChange(fullDateTime);
  }, [selectedDate, selectedTime]);

  return (
    <Collapsible className="border border-black rounded-lg overflow-hidden">
      <CollapsibleTrigger asChild>
        <div className="flex justify-between items-center hover:bg-gray-100 p-2 overflow-hidden">
          <p>{label}</p>
          <p>{formattedDateTime}</p>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent asChild>
        <div className="border-t border-t-black h-24 py-2 px-6 justify-between items-center flex gap-2">
          <DatePicker date={fullDateTime} onChange={setSelectedDate} />
          <TimeSelector time={selectedTime} onChange={(time) => {
						setSelectedTime(time)
					}} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DateTimeForm;
