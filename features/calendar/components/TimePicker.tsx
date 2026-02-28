type Props = {
  unit: "hour" | "minute" | "second";
  value: number;
  onChange: (val: number) => void;
  disabled: boolean;
};

const TimePicker = ({ unit, value, onChange, disabled }: Props) => {
  const handleTimeChange = (type: "increase" | "decrease") => {
    let newTime = value;

    if (unit === "hour") {
      newTime =
        type === "increase"
          ? value === 12
            ? 1
            : value + 1
          : value === 1
          ? 12
          : value - 1;
    } else {
      newTime = type === "increase" ? (value + 1) % 60 : (value - 1 + 60) % 60;
    }

    onChange(newTime);
  };

  return (
    <div
      className={`flex w-10 flex-col overflow-hidden rounded-lg border ${
        disabled ? "border-slate-200 bg-slate-100" : "border-slate-300 bg-white"
      }`}
    >
      <button
        type="button"
        className={`px-1 py-0.5 text-xs leading-none transition-colors
          ${
            disabled
              ? "cursor-not-allowed text-slate-400 opacity-70"
              : "text-slate-700 hover:bg-slate-50"
          }`}
        disabled={disabled}
        onClick={() => handleTimeChange("increase")}
      >
        +
      </button>
      <p
        className={`flex items-center justify-center px-1 py-1 font-mono text-xs 
        ${
          disabled
            ? "text-slate-400 opacity-70"
            : "text-slate-700"
        }`}
      >
        {value.toString().padStart(2, "0")}
      </p>
      <button
        type="button"
        className={`px-1 py-0.5 text-xs leading-none transition-colors
          ${
            disabled
              ? "cursor-not-allowed text-slate-400 opacity-70"
              : "text-slate-700 hover:bg-slate-50"
          }`}
        disabled={disabled}
        onClick={() => handleTimeChange("decrease")}
      >
        -
      </button>
    </div>
  );
};

export default TimePicker;
