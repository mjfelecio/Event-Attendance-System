"use client";

import React from "react";
import { TbSearch } from "react-icons/tb";

type Props = {
  onQueryChange: (query: string) => void;
  placeholder?: string;
};

const SearchBar = ({
  onQueryChange,
  placeholder = "Search for students...",
}: Props) => {
  return (
    <div className="flex flex-row items-center border-2 rounded-lg px-3 py-1 gap-1">
      <input
        onChange={(e) => onQueryChange(e.target.value)}
        className="focus:outline-none"
        placeholder={placeholder}
      />
      <TbSearch size={20} />
    </div>
  );
};

export default SearchBar;
