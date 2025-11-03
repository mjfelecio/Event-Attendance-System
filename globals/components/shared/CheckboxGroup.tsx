"use client";

import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/globals/components/shad-cn/button";
import {
  Command,
  CommandGroup,
} from "@/globals/components/shad-cn/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/globals/components/shad-cn/popover";
import { useState } from "react";
import { Checkbox } from "@/globals/components/shad-cn/checkbox";
import { Label } from "@/globals/components/shad-cn/label";

type CheckboxGroupProps<T extends string> = {
  choices: T[];
  placeholder: string;
  selectedValues: T[];
  onSelect: (newValues: T[]) => void;
  maxHeight?: string
};

/**
 * Checkbox Group that allows you to select multiple groups
 * The selected items are returned as an array in a two-column layout
 */
const CheckboxGroup = <T extends string>({
  choices,
  placeholder,
  selectedValues,
  onSelect,
  maxHeight = "300px", // Default max height
}: CheckboxGroupProps<T>) => {
  const [open, setOpen] = useState(false);

  const handleToggle = (item: T) => {
    const newSelectedValues = selectedValues.includes(item)
      ? selectedValues.filter((selected) => selected !== item)
      : [...selectedValues, item];

    onSelect(newSelectedValues);
  };

  // Split choices into two columns
  const midpoint = Math.ceil(choices.length / 2);
  const firstColumn = choices.slice(0, midpoint);
  const secondColumn = choices.slice(midpoint);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[250px] justify-between"
        >
          {selectedValues.length > 0 
            ? `${placeholder} (${selectedValues.length} selected)` 
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[300px] p-0">
        <Command>
          <CommandGroup>
            <div 
              className="grid grid-cols-2 gap-4 p-4"
              style={{ maxHeight, overflowY: 'auto' }}
            >
              {/* First Column */}
              <div className="space-y-2">
                {firstColumn.map((item) => (
                  <div 
                    key={item} 
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`first-${item}`}
                      checked={selectedValues.includes(item)}
                      onCheckedChange={() => handleToggle(item)}
                    />
                    <Label 
                      htmlFor={`first-${item}`} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Second Column */}
              <div className="space-y-2">
                {secondColumn.map((item) => (
                  <div 
                    key={item} 
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`second-${item}`}
                      checked={selectedValues.includes(item)}
                      onCheckedChange={() => handleToggle(item)}
                    />
                    <Label 
                      htmlFor={`second-${item}`} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Select All / Clear All Footer */}
            <div className="border-t px-4 py-2 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onSelect(choices)}
                className="text-xs"
              >
                Select All
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onSelect([])}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CheckboxGroup;
