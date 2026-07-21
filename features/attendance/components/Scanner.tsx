"use client";
import { Button } from "@/globals/components/shad-cn/button";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { IoCameraOutline } from "react-icons/io5";

// The camera surface (and its ~170KB QR-scanner dependency) is only loaded
// once the user opens the camera, not on the attendance page's first paint.
const ScannerCamera = dynamic(
  () => import("@/features/attendance/components/ScannerCamera"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    ),
  }
);

type ScannerProps = {
  /** Callback when a text is found by the scanner in a QR or Barcode */
  onRead: (id: string) => void;
  /** Whether a record is currently being saved */
  isPending?: boolean;
};

/**
 * Camera off state
 */
const CameraOffState = ({ onOpen }: { onOpen: () => void }) => (
  <div className="h-full flex flex-col items-center justify-center py-8 px-4">
    <IoCameraOutline size={200} className="text-gray-400 mb-6" />
    <p className="text-2xl font-medium text-gray-600 mb-6 text-center">
      Turn on camera to start attendance
    </p>
    <Button onClick={onOpen} size="lg" className="text-lg px-8 py-6">
      Open Camera
    </Button>
  </div>
);

/**
 * Scanner component for QR code and barcode scanning
 */
const Scanner = ({ onRead, isPending = false }: ScannerProps) => {
  const [cameraOpen, setCameraOpen] = useState(false);

  return (
    <div className="flex-1 h-full bg-white border rounded-lg flex flex-col items-center justify-center overflow-hidden">
      {cameraOpen ? (
        <ScannerCamera
          onRead={onRead}
          isPending={isPending}
          onClose={() => setCameraOpen(false)}
        />
      ) : (
        <CameraOffState onOpen={() => setCameraOpen(true)} />
      )}
    </div>
  );
};

export default Scanner;
