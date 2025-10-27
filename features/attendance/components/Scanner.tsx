"use client";

import { Button } from "@/globals/components/shad-cn/button";
import React, { useState, useRef } from "react";
import { BiSolidCameraOff } from "react-icons/bi";
import { IoCameraOutline } from "react-icons/io5";
import {
  IDetectedBarcode,
  Scanner as QRScanner,
} from "@yudiel/react-qr-scanner";

type Props = {
  /** Callback when a text is found by the scanner in a QR or Barcode */
  onRead: (id: string) => void;
};

const SCAN_EVERY_NTH_FRAME = 3;

const Scanner = ({ onRead }: Props) => {
  const [cameraOpen, setCameraOpen] = useState(false);

  // Internal refs for debounce logic
  const lastValueRef = useRef<string>("");
  const frameCountRef = useRef(0);
  const debounceUntilRef = useRef(0);

  const highlightCodeOnCanvas = (
    detectedCodes: IDetectedBarcode[],
    ctx: CanvasRenderingContext2D
  ) => {
    detectedCodes.forEach((detectedCode) => {
      const { boundingBox, cornerPoints } = detectedCode;

      // Draw bounding box
      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 4;
      ctx.strokeRect(
        boundingBox.x,
        boundingBox.y,
        boundingBox.width,
        boundingBox.height
      );

      // Draw corner points
      ctx.fillStyle = "#FF0000";
      cornerPoints.forEach((point: { x: number; y: number }) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  };

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (!detectedCodes || detectedCodes.length === 0) return;

    // Process only every Nth frame
    frameCountRef.current = (frameCountRef.current + 1) % SCAN_EVERY_NTH_FRAME;
    if (frameCountRef.current !== 0) return;

    const now = Date.now();
    if (now < debounceUntilRef.current) return;

    const rawValue = detectedCodes[0]?.rawValue?.trim();
    if (!rawValue) return;

    // If same code scanned recently, debounce cooldown
    if (rawValue === lastValueRef.current) {
      debounceUntilRef.current = now + 1000; // 1 second cooldown
      return;
    }

    lastValueRef.current = rawValue;
    debounceUntilRef.current = now + 1200; // Set cooldown for new scan

    onRead(rawValue);
  };

  return (
    <div className="flex-2 h-full bg-white border-2 rounded-md flex flex-col items-center justify-center text-white">
      {cameraOpen ? (
        <div className="overflow-hidden rounded-md relative">
          <QRScanner
            components={{
              finder: false,
              tracker: highlightCodeOnCanvas,
            }}
            onScan={handleScan}
            paused={!cameraOpen}
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
