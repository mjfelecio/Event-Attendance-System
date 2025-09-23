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
import { EVENT_CHOICES } from "@/features/calendar/constants/index";
import { Textarea } from "@/globals/components/shad-cn/textarea";
import { Switch } from "@/globals/components/shad-cn/switch";
import DateTimeForm from "@/features/calendar/components/DateTimeForm";
import { Controller, useWatch } from "react-hook-form";
import { useEventForm } from "@/features/calendar/hooks/useEventForm";
import { useAddEvent } from "@/globals/hooks/useEvents";

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const EventDrawer = ({ isOpen, onOpenChange }: Props) => {
  const { mutate: addEvent } = useAddEvent();

  const {
    control,
    handleSubmit,
    resetForm,
    formState: { errors },
  } = useEventForm((data) => {
    addEvent(data);
    onOpenChange(false);
  });

  const allDay = useWatch({
    control,
    name: "allDay",
  });

  const handleDrawerClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
      <DrawerContent>
        <form
          onSubmit={handleSubmit}
          className="h-full w-full overflow-y-auto bg-white"
        >
          <DrawerHeader>
            <DrawerTitle className="text-center text-2xl">
              Create Event
            </DrawerTitle>
          </DrawerHeader>

          {/* Form Content */}
          <div className="px-4 flex flex-col gap-3 pb-24">
            {/* Title */}
            <div>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <FormInput
                    label="Title"
                    placeholder="Enter event title"
                    onValueChange={field.onChange}
                    value={field.value}
                  />
                )}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Location */}
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Location"
                  placeholder="Enter event location (optional)"
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                />
              )}
            />

            {/* Category */}
            <div>
              <Label className="text-md mb-1">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <ComboBox
                    selectedValue={field.value}
                    choices={EVENT_CHOICES}
                    placeholder="Select event category"
                    searchFallbackMsg="No category found"
                    onSelect={(v) => field.onChange(v)}
                  />
                )}
              />
              {errors.category && (
                <p className="text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Schedule */}
            <div>
              <p className="text-md font-medium mb-2">Schedule</p>
              <div className="w-full rounded-xl flex flex-col gap-2">
                {/* All Day */}
                <div className="flex flex-row items-center gap-3">
                  <p className="font-medium text-sm">All Day</p>
                  <Controller
                    name="allDay"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <Controller
                  name="start"
                  control={control}
                  render={({ field }) => (
                    <DateTimeForm
                      date={field.value}
                      onDateTimeChange={field.onChange}
                      label="Start"
                      allDay={allDay}
                    />
                  )}
                />

                <Controller
                  name="end"
                  control={control}
                  render={({ field }) => (
                    <DateTimeForm
                      date={field.value}
                      onDateTimeChange={field.onChange}
                      label="End"
                      allDay={allDay}
                    />
                  )}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-md mb-1">
                Description
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    placeholder="Optional description about the event"
                    id="description"
                    className="h-24 resize-none"
                    {...field}
                  />
                )}
              />
            </div>
          </div>

          <DrawerFooter className="absolute w-full bottom-0 flex items-end bg-white">
            <div className="h-8 flex items-center gap-4">
              <DrawerClose asChild>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDrawerClose}
                >
                  Close
                </Button>
              </DrawerClose>
              <Button type="submit" variant="default">
                Save
              </Button>
            </div>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default EventDrawer;
