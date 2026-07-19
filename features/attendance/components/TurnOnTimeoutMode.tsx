"use client"

import { Button } from "@/globals/components/shad-cn/button";
import { useState } from "react";
import useToggleTimeoutMode from "@/features/attendance/hooks/useStartTimeoutMode";

interface Props {
  eventId?: string;
  isTimeout: boolean;
}

/**
 * Toggles the event between time-in mode and time-out mode.
 * Scans record a time-in while the mode is off, and a time-out while it is on.
 */
const TurnOnTimeoutMode = ({ eventId, isTimeout }: Props) => {
  const { mutate, isPending } = useToggleTimeoutMode();
  const [activated, setActivated] = useState(isTimeout);

  const handleClick = () => {
    if (!eventId) return;

    mutate(eventId, {
      onSuccess: (updated) => {
        setActivated(updated.isTimeout);
      },
    });
  };

  if (!eventId) return null;

  return (
    <Button
      variant={activated ? "secondary" : "destructive"}
      disabled={isPending}
      onClick={handleClick}
    >
      {isPending
        ? "Switching..."
        : activated
          ? "Timeout Mode: ON (tap to record time-ins)"
          : "Start Recording Timeout"}
    </Button>
  );
};

export default TurnOnTimeoutMode;
