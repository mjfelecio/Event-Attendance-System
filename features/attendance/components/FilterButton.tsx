import { Filter } from "lucide-react";
import React, { useState } from "react";

const FilterButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-800"
        aria-expanded={isOpen}
        aria-controls="student-filter-popover"
      >
        <Filter className="size-4" strokeWidth={1.6} />
        Filter
      </button>
    </div>
  );
};

export default FilterButton;
