import React, { useState } from "react";
import TimePicker from "@/features/calendar/components/TimePicker";

type Time = {
  hour: number;
  minute: number;
  second: number;
  period: "AM" | "PM";
};

type Props = {
  time: Time;
  onChange: (time: Time) => void;
};

const TimeSelector = ({ time, onChange }: Props) => {
  const updateTime = (unit: keyof Time, value: number | "AM" | "PM") => {
    const updated = { ...time, [unit]: value } as Time;
    onChange(updated);
  };

  return (
    <div className="flex gap-2 items-center">
      <TimePicker
        unit="hour"
        value={time.hour}
        onChange={(val) => updateTime("hour", val)}
      />
      <span>:</span>
      <TimePicker
        unit="minute"
        value={time.minute}
        onChange={(val) => updateTime("minute", val)}
      />

      <button
        type="button"
        className="ml-2 text-sm border border-black px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
        onClick={() => updateTime("period", time.period === "AM" ? "PM" : "AM")}
      >
        {time.period}
      </button>
    </div>
  );
};

export default TimeSelector;
