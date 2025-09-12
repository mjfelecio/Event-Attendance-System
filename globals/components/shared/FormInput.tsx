"use client";

import { Input } from "../shad-cn/input";
import { Label } from "../shad-cn/label";

type Props = {
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (newValue: string) => void;
};

const FormInput = ({ label, placeholder, value, onValueChange }: Props) => {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="" className="text-gray-700 text-md">{label}</Label>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      />
    </div>
  );
};

export default FormInput;
