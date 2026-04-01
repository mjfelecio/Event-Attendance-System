import React from "react";
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
    <div className="flex items-center gap-2 sm:justify-end">
      <TimePicker
        unit="hour"
        value={time.hour}
        onChange={(val) => updateTime("hour", val)}
        disabled={disabled}
      />
      <span className="text-sm font-semibold text-slate-400">:</span>
      <TimePicker
        unit="minute"
        value={time.minute}
        onChange={(val) => updateTime("minute", val)}
        disabled={disabled}
      />

      <button
        type="button"
        className={`ml-1 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors
          ${
            disabled
              ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 opacity-70"
              : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
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
