"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/globals/components/shad-cn/command";
import { Popover, PopoverAnchor, PopoverContent } from "@/globals/components/shad-cn/popover";
import { ComboBoxValue } from "@/globals/components/shared/ComboBox";
import React, { useState } from "react";
import { TbSearch } from "react-icons/tb";

type Props = {
  onQueryChange: (query: string) => void;
  onSelect: (value: string) => void;
  placeholder?: string;
  choices: ComboBoxValue[];
};

const SearchBar = ({
  onQueryChange,
  placeholder = "Search for students...",
  choices,
  onSelect,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleQueryChange = (value: string) => {
    setQuery(value);
    // Show results while the user is actively searching; hide when the box is
    // cleared. (Previously inverted: it opened on empty and closed on typing.)
    setOpen(value.trim().length > 0);
    onQueryChange(value);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Anchor (not Trigger) so the input isn't nested inside Radix's button */}
      <PopoverAnchor asChild>
        <div className="flex flex-row items-center bg-white border-2 rounded-lg px-3 py-1 gap-1">
          <input
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setOpen(query.trim().length > 0)}
            className="focus:outline-none flex-1"
            placeholder={placeholder}
          />
          <TbSearch size={20} />
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="min-w-[200px] p-0"
        // Keep focus in the input so typing isn't interrupted when results open
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command shouldFilter={false}>
          <CommandList>
            <CommandEmpty>No students found</CommandEmpty>
            <CommandGroup>
              {choices?.map((choice) => (
                <CommandItem
                  key={choice.value}
                  value={choice.value}
                  onSelect={(currentValue) => {
                    setOpen(false);
                    onSelect(currentValue);
                  }}
                >
                  {choice.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchBar;
