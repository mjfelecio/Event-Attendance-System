"use client";
import { Button } from "@/globals/components/shad-cn/button";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { IoCameraOutline } from "react-icons/io5";
import { surface } from "@/globals/constants/designTokens";
import { cn } from "@/globals/libs/shad-cn";

// The camera surface (and its ~170KB QR-scanner dependency) is only loaded
// once the user opens the camera, not on the attendance page's first paint.
const ScannerCamera = dynamic(
  () => import("@/features/attendance/components/ScannerCamera"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[380px] items-center justify-center sm:min-h-[440px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
      </div>
    ),
  }
);

type ScannerProps = {
  /** Callback when a text is found by the scanner in a QR or Barcode */
  onRead: (id: string) => void;
  /** Whether a record is currently being saved */
  isPending?: boolean;
  /** The event scans are currently being recorded against, if any. */
  eventId?: string;
};

/**
 * Camera off state
 */
const CameraOffState = ({ onOpen }: { onOpen: () => void }) => (
  <div className="flex flex-col items-center justify-center px-4 py-6 sm:py-8">
    <IoCameraOutline className="size-16 text-slate-400 mb-4 sm:size-24 sm:mb-6 md:size-28" />
    <p className="text-base font-medium text-slate-600 mb-4 text-center sm:text-lg sm:mb-6">
      Turn on camera to start attendance
    </p>
    <Button
      onClick={onOpen}
      size="lg"
      className="text-sm px-6 py-4 sm:text-base sm:px-8 sm:py-6"
    >
      Open Camera
    </Button>
  </div>
);

/**
 * Scanner component for QR code and barcode scanning
 */
const Scanner = ({ onRead, isPending = false, eventId }: ScannerProps) => {
  const [cameraOpen, setCameraOpen] = useState(false);

  return (
    <div
      className={cn(
        surface.card,
        "flex h-[380px] flex-col items-center justify-center overflow-hidden p-4 sm:h-[440px]"
      )}
    >
      {cameraOpen ? (
        <ScannerCamera
          onRead={onRead}
          isPending={isPending}
          onClose={() => setCameraOpen(false)}
          eventId={eventId}
        />
      ) : (
        <CameraOffState onOpen={() => setCameraOpen(true)} />
      )}
    </div>
  );
};

export default Scanner;
