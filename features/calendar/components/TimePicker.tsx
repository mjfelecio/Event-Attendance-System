import { useState } from "react";

type Props = {
  unit: "hour" | "minute" | "second";
  value: number;
  onChange: (val: number) => void;
};

const TimePicker = ({ unit, value, onChange }: Props) => {
  const [time, setTime] = useState(value);

  const handleTimeChange = (type: "increase" | "decrease") => {
    setTime((prev) => {
      let next = prev;
      if (unit === "hour") {
        next =
          type === "increase"
            ? prev === 12
              ? 1
              : prev + 1
            : prev === 1
            ? 12
            : prev - 1;
      } else {
        next = type === "increase" ? (prev + 1) % 60 : (prev - 1 + 60) % 60;
      }
      onChange(next);

      return next;
    });
  };

  return (
    <div className="flex flex-col border border-black rounded-2xl overflow-hidden w-6">
      <button
        className="hover:bg-gray-100 p-0.5 transition-colors"
        onClick={() => handleTimeChange("increase")}
      >
        +
      </button>
      <p className="p-0.5 flex justify-center items-center font-mono text-sm">
        {time.toString().padStart(2, "0")}
      </p>
      <button
        className="hover:bg-gray-100 p-0.5 transition-colors"
        onClick={() => handleTimeChange("decrease")}
      >
        -
      </button>
    </div>
  );
};

export default TimePicker;
