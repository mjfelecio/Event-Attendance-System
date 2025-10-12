"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/globals/libs/shad-cn";
import { Button } from "@/globals/components/shad-cn/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/globals/components/shad-cn/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/globals/components/shad-cn/popover";

export type ComboBoxValue = {
  value: string;
  label: string;
};

type ComboBoxProps = {
  choices: ComboBoxValue[];
  placeholder: string;
  searchFallbackMsg: string;
  selectedValue: string;
  onSelect: (value: string) => void;
};

const ComboBox = ({
  choices,
  onSelect,
  placeholder,
  searchFallbackMsg,
  selectedValue
}: ComboBoxProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[200px] justify-between"
        >
          {selectedValue
            ? choices.find((choice) => choice.value === selectedValue)?.label
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{searchFallbackMsg}</CommandEmpty>
            <CommandGroup>
              {choices.map((choice) => (
                <CommandItem
                  key={choice.value}
                  value={choice.value}
                  onSelect={(currentValue) => {
                    setOpen(false);
                    onSelect(currentValue)
                  }}
                >
                  {choice.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedValue === choice.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboBox;
