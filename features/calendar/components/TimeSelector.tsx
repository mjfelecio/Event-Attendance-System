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
  disabled: boolean;
};

const TimeSelector = ({ time, onChange, disabled }: Props) => {
  const updateTime = (unit: keyof Time, value: number | "AM" | "PM") => {
    const updated = { ...time, [unit]: value } as Time;
    onChange(updated);
  };

  return (
    <div className="flex relative gap-2 items-center">
      <TimePicker
        unit="hour"
        value={time.hour}
        onChange={(val) => updateTime("hour", val)}
        disabled={disabled}
      />
      <span>:</span>
      <TimePicker
        unit="minute"
        value={time.minute}
        onChange={(val) => updateTime("minute", val)}
        disabled={disabled}
      />

      <button
        type="button"
        className={`ml-2 text-sm border px-2 py-1 rounded-md transition-colors
          ${
            disabled
              ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed opacity-50"
              : "border-black text-black hover:bg-gray-100 cursor-pointer"
          }`}
        disabled={disabled}
        onClick={() => updateTime("period", time.period === "AM" ? "PM" : "AM")}
      >
        {time.period}
      </button>
    </div>
  );
};

export default TimeSelector;
