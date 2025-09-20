"use client";

import { Input } from "@/globals/components/shad-cn/input";
import { Label } from "@/globals/components/shad-cn/label";

type Props = {
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (newValue: string) => void;
};

const FormInput = ({ label, placeholder, value, onValueChange }: Props) => {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={`input-${label}`} className="text-black text-md">
        {label}
      </Label>
      <Input
        id={`input-${label}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      />
    </div>
  );
};

export default FormInput;
