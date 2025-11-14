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

type Props = {
  /** Callback when a text is found by the scanner in a QR or Barcode */
  onRead: (id: string) => void;
};

const Scanner = ({ onRead }: Props) => {
  const [cameraOpen, setCameraOpen] = useState(false);

  const lastScannedRef = useRef<{ value: string; timestamp: number }>({
    value: "",
    timestamp: 0,
  });

  const handleScan = useCallback((detectedCodes: IDetectedBarcode[]) => {
    if (!detectedCodes?.length) return;

    const now = Date.now();
    const rawValue = detectedCodes[0]?.rawValue?.trim();

    if (!rawValue) return;

    // Check if the scannedValue is the same as the last scan.
    // If it is, then debounce for 1 second
    const timeSinceLastScan = now - lastScannedRef.current.timestamp;
    const isDuplicate =
      rawValue === lastScannedRef.current.value && timeSinceLastScan < 1000; // 2-second window

    if (!isDuplicate) {
      lastScannedRef.current = { value: rawValue, timestamp: now };
      onRead(rawValue);
    }
  }, []);

  return (
    <div className="flex-1 h-full bg-white border-2 rounded-md flex flex-col items-center justify-center text-white">
      {cameraOpen ? (
        <div className="overflow-hidden rounded-md relative max-h-[600px]">
          <QRScanner
            components={{
              finder: false,
              tracker: centerText,
              onOff: true,
            }}
            onScan={handleScan}
            paused={!cameraOpen}
            onError={(error) => {
              console.log(`onError: ${error}'`);
            }}
          />
          <div
            onClick={() => setCameraOpen(false)}
            className="absolute top-4 right-4"
          >
            <BiSolidCameraOff size={64} color="black" />
          </div>
        </div>
      ) : (
        <div className="py-4 h-full flex flex-col items-center justify-center">
          <IoCameraOutline size={260} color="black" />
          <p className="text-2xl font-medium text-gray-500">
            Turn on camera to start attendance
          </p>
          <Button
            onClick={() => setCameraOpen((prev) => !prev)}
            size={"default"}
            className="mt-2 mb-4 text-xl"
          >
            Open Camera
          </Button>
        </div>
      )}
    </div>
  );
};

export default Scanner;
