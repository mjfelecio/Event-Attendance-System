"use client";

import { Input } from "@/globals/components/shad-cn/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../shad-cn/field";
import { Info } from "lucide-react";
import { ComponentProps, forwardRef } from "react";

interface FormInputProps extends ComponentProps<typeof Input> {
  label: string;
  description?: string;
  error?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, description, error, id, className, ...props }, _ref) => {
    const inputId = id ?? `input-${label.replace(/\s+/g, "-").toLowerCase()}`;

    return (
      <Field className="gap-1.5">
        <FieldLabel
          htmlFor={inputId}
          className="text-[10px] uppercase font-bold text-slate-400 ml-1"
        >
          {label}
        </FieldLabel>
        <Input
          id={inputId}
          className={`border-slate-200 rounded-xl mb-0 ${className}`}
          {...props}
        />
        {description && !error && (
          <FieldDescription className="text-[11px] ml-1 mt-1 flex items-center text-slate-500">
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
  },
);

FormInput.displayName = "FormInput";
export default FormInput;
