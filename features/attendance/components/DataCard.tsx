"use client"

import React from "react";
import { IconType } from "react-icons/lib";

type Props = {
  title: string;
  subtitle: string;
  icon: IconType;
  value: number;
  isPercentage?: boolean;
};

const DataCard = ({
  title,
  subtitle,
  icon: Icon,
  value,
  isPercentage = false,
}: Props) => {
  return (
    <div className="border-2 border-gray-300 rounded-md p-3 flex flex-col justify-center items-between gap-2 w-64">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold">{title}</p>
        <Icon size={24} />
      </div>
      <div className="flex justify-between items-end">
        <h1 className="flex flex-1 items-center justify-center font-mono text-5xl">
          {value}
          {isPercentage && "%"}
        </h1>

        <p className="text-sm">{subtitle}</p>
      </div>
    </div>
  );
};

export default DataCard;
