"use client";

import { useCallback, useRef } from "react";
import { BiSolidCameraOff } from "react-icons/bi";
import {
  centerText,
  IDetectedBarcode,
  Scanner as QRScanner,
} from "@yudiel/react-qr-scanner";

type ScannerCameraProps = {
  onRead: (id: string) => void;
  isPending: boolean;
  onClose: () => void;
};

/**
 * The actual camera surface. Split out of Scanner so the heavy
 * @yudiel/react-qr-scanner dependency is only pulled in (via next/dynamic)
 * after the user opens the camera - keeping it off the attendance page's
 * initial bundle.
 */
const ScannerCamera = ({ onRead, isPending, onClose }: ScannerCameraProps) => {
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
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-full h-full max-w-[500px] max-h-[500px]">
        <QRScanner
          components={{
            finder: false,
            tracker: centerText,
            onOff: true,
          }}
          onScan={handleScan}
          paused={isPending}
          onError={(error) => {
            console.error("Scanner error:", error);
          }}
        />
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
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
  );
};

export default ScannerCamera;
