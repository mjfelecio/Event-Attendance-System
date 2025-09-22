type Props = {
  unit: "hour" | "minute" | "second";
  value: number;
  onChange: (val: number) => void;
};

const TimePicker = ({ unit, value, onChange }: Props) => {
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
    <div className="flex flex-col border border-black rounded-2xl overflow-hidden w-6">
      <button
        type="button"
        className="hover:bg-gray-100 p-0.5 transition-colors"
        onClick={() => handleTimeChange("increase")}
      >
        +
      </button>
      <p className="p-0.5 flex justify-center items-center font-mono text-sm">
        {value.toString().padStart(2, "0")}
      </p>
      <button
        type="button"
        className="hover:bg-gray-100 p-0.5 transition-colors"
        onClick={() => handleTimeChange("decrease")}
      >
        -
      </button>
    </div>
  );
};

export default TimePicker;
