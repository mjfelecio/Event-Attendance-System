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
      className={`flex flex-col border border-black rounded-2xl overflow-hidden w-6 ${
        disabled && "border-gray-300"
      }`}
    >
      <button
        type="button"
        className={`text-sm p-0.5 transition-colors
          ${
            disabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
              : "text-black hover:bg-gray-100 cursor-pointer"
          }`}
        disabled={disabled}
        onClick={() => handleTimeChange("increase")}
      >
        +
      </button>
      <p
        className={`p-0.5 flex justify-center items-center font-mono text-sm 
        ${
          disabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
            : "text-black hover:bg-gray-100 cursor-pointer"
        }`}
      >
        {value.toString().padStart(2, "0")}
      </p>
      <button
        type="button"
        className={`text-sm p-0.5 transition-colors
          ${
            disabled
              ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed opacity-50"
              : "text-black hover:bg-gray-100 cursor-pointer"
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
