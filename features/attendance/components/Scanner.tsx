"use client";
import { Button } from "@/globals/components/shad-cn/button";
import React, { useState, useRef, useCallback } from "react";
import { BiSolidCameraOff } from "react-icons/bi";
import { IoCameraOutline } from "react-icons/io5";
import {
  centerText,
  IDetectedBarcode,
  Scanner as QRScanner,
} from "@yudiel/react-qr-scanner";

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
    <Button
      onClick={onOpen}
      size="lg"
      className="text-lg px-8 py-6"
    >
      Open Camera
    </Button>
  </div>
);

/**
 * Scanner component for QR code and barcode scanning
 */
const Scanner = ({ onRead, isPending = false }: ScannerProps) => {
  const [cameraOpen, setCameraOpen] = useState(false);
  const lastScannedRef = useRef<{ value: string; timestamp: number }>({
    value: "",
    timestamp: 0,
  });

  const handleScan = useCallback(
    (detectedCodes: IDetectedBarcode[]) => {
      if (!detectedCodes?.length || isPending) return;

      const now = Date.now();
      const rawValue = detectedCodes[0]?.rawValue?.trim();

      if (!rawValue) return;

      // Debounce duplicate scans within 1 second
      const timeSinceLastScan = now - lastScannedRef.current.timestamp;
      const isDuplicate =
        rawValue === lastScannedRef.current.value && timeSinceLastScan < 1000;

      if (!isDuplicate) {
        lastScannedRef.current = { value: rawValue, timestamp: now };
        onRead(rawValue);
      }
    },
    [onRead, isPending]
  );

  return (
    <div className="flex-1 h-full bg-white border-2 rounded-lg flex flex-col items-center justify-center overflow-hidden">
      {cameraOpen ? (
        <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
          <div className="w-full h-full max-w-[500px] max-h-[500px]">
            <QRScanner
              components={{
                finder: false,
                tracker: centerText,
                onOff: true,
              }}
              onScan={handleScan}
              paused={!cameraOpen || isPending}
              onError={(error) => {
                console.error("Scanner error:", error);
              }}
            />
          </div>
          
          {/* Close button */}
          <button
            onClick={() => setCameraOpen(false)}
            className="absolute top-4 right-4 p-2 bg-slate-200 hover:bg-white rounded-lg transition-colors"
            aria-label="Close camera"
          >
            <BiSolidCameraOff size={32} className="text-gray-800" />
          </button>

          {/* Processing overlay */}
          {isPending && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
                <p className="text-lg font-medium">Processing...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <CameraOffState onOpen={() => setCameraOpen(true)} />
      )}
    </div>
  );
};

export default Scanner;