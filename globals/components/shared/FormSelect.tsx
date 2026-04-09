"use client";

import { useController, Control } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/globals/components/shad-cn/select";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../shad-cn/field";
import { Option } from "@/globals/types/primitives";
import { Info } from "lucide-react";

interface FormSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  options: Option[];
  control: Control<any>;
  description?: string;
  error?: string;
}

const FormSelect = ({
  name,
  label,
  placeholder,
  options,
  control,
  description,
  error,
}: FormSelectProps) => {
  const {
    field: { value, onChange, ref },
  } = useController({
    name,
    control,
    defaultValue: "",
  });

  return (
    <Field className="gap-1.5">
      <FieldLabel className="text-[10px] uppercase font-bold text-slate-400 ml-1">
        {label}
      </FieldLabel>
      <Select onValueChange={onChange} value={value ?? ""}>
        <SelectTrigger
          ref={ref}
          className="border-slate-200 rounded-xl focus:ring-slate-900"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-slate-200">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {description && !error && (
        <FieldDescription className="text-[11px] ml-1 mt-1 text-slate-500">
          {description}
        </FieldDescription>
      )}

      {error && (
        <FieldError className="flex items-center-safe text-[11px] font-medium text-rose-500 ml-1">
          <Info size={12} className="mr-1 inline-block" />
          {error}
        </FieldError>
      )}
    </Field>
  );
};

export default FormSelect;
