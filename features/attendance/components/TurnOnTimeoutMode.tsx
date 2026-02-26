"use client"

import { Button } from "@/globals/components/shad-cn/button";
import { useState } from "react";
import useStartTimeoutMode from "@/features/attendance/hooks/useStartTimeoutMode";

interface Props {
  eventId?: string;
  isTimeout: boolean;
}

const TurnOnTimeoutMode = ({ eventId, isTimeout }: Props) => {
  const { mutate, isPending } = useStartTimeoutMode();
  const [activated, setActivated] = useState(isTimeout);

  const handleClick = () => {
		if (!eventId) return

		if (!confirm("This action cannot be undone")) return;

    mutate(eventId, {
      onSuccess: () => {
        setActivated(true);
      },
    });
  };

	if (!eventId) return null;

  return (
    <Button
      variant={isTimeout ? "secondary" : "destructive"}
      disabled={activated || isPending}
      onClick={handleClick}
    >
      {activated ? "Timeout Mode Active" : "Start Recording Timeout"}
    </Button>
  );
};

export default TurnOnTimeoutMode;
