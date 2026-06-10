"use client";

import { Button } from "@/globals/components/shad-cn/button";
import { useState } from "react";
import useStartTimeoutMode from "@/features/attendance/hooks/useStartTimeoutMode";
import { ClockIcon } from "lucide-react";

type Props = {
  eventId?: string;
  isTimeout: boolean;
};

const TurnOnTimeoutMode = ({ eventId, isTimeout }: Props) => {
  const { mutate, isPending } = useStartTimeoutMode();
  const [activated, setActivated] = useState(isTimeout);

  const handleClick = () => {
    if (!eventId) return;

    if (!confirm("This action cannot be undone")) return;

    mutate(eventId, {
      onSuccess: () => {
        setActivated(true);
      },
    });
  };

  if (!eventId) return null;

  if (activated) {
    return (
      <div
        className="
          flex items-center gap-2
          rounded-md
          border
          px-3 py-1
          bg-amber-50
          text-amber-800
        "
      >
        <ClockIcon className="size-4" />
        <span className="font-medium">Timeout Mode Active</span>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      className="border-amber-500 text-amber-700"
      disabled={activated || isPending}
      onClick={handleClick}
    >
      <ClockIcon />
      Start Timeout Mode
    </Button>
  );
};

export default TurnOnTimeoutMode;
