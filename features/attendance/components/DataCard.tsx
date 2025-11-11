"use client";

import React from "react";
import { IconType } from "react-icons/lib";
import { twMerge } from "tailwind-merge"; // optional if you use Tailwind + want safer class merging

type DataCardProps = {
  title: string;
  subtitle: string;
  icon: IconType;
  value?: number | string;
  isPercentage?: boolean;
  isLoading?: boolean;
  className?: string;
};

const DataCard: React.FC<DataCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  value,
  isPercentage = false,
  isLoading = false,
  className,
}) => {
  const renderValue = () => {
    if (isLoading) {
      return (
        <div className="h-12 w-20 bg-gray-200 animate-pulse rounded-md" />
      );
    }

    if (value === undefined || value === null || value === "" || isNaN(Number(value))) {
      return <span className="text-4xl text-red-400 font-bold">None</span>;
    }

    return (
      <span className="text-4xl font-mono font-semibold">
        {value}
        {isPercentage && "%"}
      </span>
    );
  };

  return (
    <div
      className={twMerge(
        "border-2 border-gray-200 hover:border-gray-300 shadow-sm rounded-lg p-4 flex flex-col justify-between gap-3 transition-all duration-200 w-64 bg-white",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        <Icon size={28} className="text-gray-500" />
      </div>

      {/* Content */}
      <div className="flex flex-col items-start gap-1">
        {renderValue()}
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
};

export default DataCard;
