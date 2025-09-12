"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/globals/components/shad-cn/button";
import { Calendar } from "@/globals/components/shad-cn/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/globals/components/shad-cn/popover";
import { useState } from "react";

type Props = {
  onChange: (date: Date) => void;
};

const DatePicker = ({ onChange }: Props) => {
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) return;
    setDate(newDate);
    onChange(newDate);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="w-32 data-[empty=true]:text-muted-foreground justify-start text-left font-normal border-black"
        >
          <CalendarIcon className="h-4 w-4" />
          {date ? format(date, "EEE, MMM d") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          required
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
