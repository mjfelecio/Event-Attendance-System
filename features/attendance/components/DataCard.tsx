"use client";

import React from "react";
import { IconType } from "react-icons/lib";
import { twMerge } from "tailwind-merge";

type DataCardProps = {
  label: string;
  description?: string;
  icon: IconType;
  value: string;
  isLoading: boolean;
  className?: string;
};

const DataCard = ({
  label,
  description,
  icon: Icon,
  value,
  isLoading,
  className,
}: DataCardProps) => {
  return (
    <div
      className={twMerge(
        "rounded-lg border bg-white p-4 shadow-sm flex flex-col gap-3 min-w-[220px]",
        className
      )}
    >
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{label}</span>
        <Icon className="size-5" />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-3xl font-mono font-semibold">{isLoading ? "—" : value}</span>
        {description && (
          <span className="text-xs text-muted-foreground">
            {description}
          </span>
        )}
      </div>
    </div>
  );
};

export default DataCard;
