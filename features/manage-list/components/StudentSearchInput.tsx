'use client';

interface StudentSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const StudentSearchInput = ({ value, onChange }: StudentSearchInputProps) => {
  return (
    <div className="flex w-full min-w-[240px] flex-1 items-center justify-end md:w-auto">
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search students..."
        className="w-full rounded-full border border-neutral-300 bg-white px-5 py-2 text-sm font-normal text-neutral-700 shadow-sm transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40 md:w-72"
      />
    </div>
  );
};

export default StudentSearchInput;
