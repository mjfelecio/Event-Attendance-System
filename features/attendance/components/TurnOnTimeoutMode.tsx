"use client"

import { Button } from "@/globals/components/shad-cn/button";
import useToggleTimeoutMode from "@/features/attendance/hooks/useStartTimeoutMode";

interface Props {
  eventId?: string;
  /** Current server-truth mode for the event (kept fresh by the caller). */
  isTimeout: boolean;
  /** Whether the current user may change the mode (owner or admin). */
  canToggle?: boolean;
}

/**
 * Switches the event between recording time-ins and time-outs.
 *
 * The mode is driven entirely by the `isTimeout` prop (server truth), not a
 * one-time local copy, so a change made on another device is reflected here
 * once the caller's event query refreshes.
 */
const TurnOnTimeoutMode = ({ eventId, isTimeout, canToggle = true }: Props) => {
  const { mutate, isPending } = useToggleTimeoutMode();

  const handleClick = () => {
    if (!eventId) return;
    mutate({ eventId, isTimeout: !isTimeout });
  };

  if (!eventId || !canToggle) return null;

  return (
    <Button
      variant={isTimeout ? "secondary" : "destructive"}
      disabled={isPending}
      onClick={handleClick}
      className="h-auto w-full whitespace-normal py-2 text-center leading-snug"
    >
      {isPending
        ? "Switching..."
        : isTimeout
          ? "Timeout Mode: ON (tap to record time-ins)"
          : "Start Recording Timeout"}
    </Button>
  );
};

export default TurnOnTimeoutMode;
