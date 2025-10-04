"use client"

import { Button } from "@/globals/components/shad-cn/button";
import React, { useState } from "react";
import { BiSolidCameraOff } from "react-icons/bi";
import { IoCameraOutline } from "react-icons/io5";
import BarcodeScanner from "react-qr-barcode-scanner";

type Props = {
	/** Callback when a text is found by the scanner in a QR or Barcode */
	onRead: (id: string) => void;
};


/** Component that encapsulates the ID scanning functionality and returns the result as a string */
const Scanner = ({ onRead }: Props) => {
  const [cameraOpen, setCameraOpen] = useState(false);

  return (
    <div className="flex-1 max-h-96 bg-gray-300 rounded-md flex flex-col items-center justify-center text-white">
      {cameraOpen ? (
        <div className="overflow-hidden rounded-md relative">
          <BarcodeScanner
            onUpdate={(err, result) => {
              if (result) onRead(result.getText());
            }}
            stopStream={cameraOpen}
          />
          <div
            onClick={() => setCameraOpen(false)}
            className="absolute top-4 right-4"
          >
            <BiSolidCameraOff size={64} />
          </div>
        </div>
      ) : (
        <>
          <IoCameraOutline size={320} />
          <p className="text-2xl font-medium">
            Turn on camera to start attendance
          </p>
          <Button
            onClick={() => setCameraOpen((prev) => !prev)}
            size={"lg"}
            variant={"secondary"}
            className="my-4 text-xl"
          >
            Open Camera
          </Button>
        </>
      )}
    </div>
  );
};

export default Scanner;
