"use client";

import { Button } from "@/globals/components/shad-cn/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/globals/components/shad-cn/drawer";
import { Label } from "@/globals/components/shad-cn/label";
import ComboBox from "@/globals/components/shared/ComboBox";
import FormInput from "@/globals/components/shared/FormInput";
import React, { useState } from "react";
import EventScheduleForm from "./EventScheduleForm";
import { EVENT_CHOICES } from "@/features/calendar/constants/index";
import { Textarea } from "@/globals/components/shad-cn/textarea";

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const EventDrawer = ({ isOpen, onOpenChange }: Props) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
      <DrawerContent>
        <div className="h-full w-full overflow-y-auto bg-white">
          <DrawerHeader>
            <DrawerTitle className="text-center text-2xl">
              Create Event
            </DrawerTitle>
          </DrawerHeader>

          {/* Form Content */}
          <div className="px-4 flex flex-col gap-3 pb-24">
            <FormInput
              label="Title"
              placeholder="Enter event title"
              value={title}
              onValueChange={setTitle}
            />

            <FormInput
              label="Location"
              placeholder="Enter event location (optional)"
              value={location}
              onValueChange={setLocation}
            />

            <div>
              <Label className="text-md mb-1">Category</Label>
              <ComboBox
                choices={EVENT_CHOICES}
                onSelect={(v) =>
                  alert(`Selected ${v.label} as the category type`)
                }
                placeholder="Select event category"
                searchFallbackMsg="No category found"
              />
            </div>

            <EventScheduleForm />

            <div>
              <Label htmlFor="description" className="text-md mb-1">
                Description
              </Label>
              <Textarea
                placeholder="Optional description about the event"
                id="description"
                className="h-24 resize-none"
              />
            </div>
          </div>

          <DrawerFooter className="absolute w-full bottom-0 flex items-end bg-white">
            <div className="h-8 flex items-center gap-4">
              <DrawerClose asChild>
                <Button variant="destructive">Close</Button>
              </DrawerClose>
              <Button variant="default">Save</Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EventDrawer;
