"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/globals/components/shad-cn/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/globals/components/shad-cn/popover";
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

  const handleQueryChange = (query: string) => {
    const openState = query.length <= 0;
    setOpen(openState);
    console.log(query.length);
    onQueryChange(query);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div className="flex flex-row items-center border-2 rounded-lg px-3 py-1 gap-1">
          <input
            onChange={(e) => handleQueryChange(e.target.value)}
            className="focus:outline-none"
            placeholder={placeholder}
          />
          <TbSearch size={20} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="min-w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>{placeholder}</CommandEmpty>
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
