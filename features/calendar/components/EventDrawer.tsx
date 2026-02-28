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
import { Textarea } from "@/globals/components/shad-cn/textarea";
import { Switch } from "@/globals/components/shad-cn/switch";
import DateTimeForm from "@/features/calendar/components/DateTimeForm";
import { Controller } from "react-hook-form";
import { formatEventPayload, useEventForm } from "@/features/calendar/hooks/useEventForm";
import {
  useDeleteEvent,
  useSaveEvent,
  useApproveEvent,
  useSubmitEvent,
} from "@/globals/hooks/useEvents";
import { Event } from "@/globals/types/events";
import {
  CATEGORY_GROUPS,
  EVENT_CHOICES,
} from "@/features/calendar/constants/categoryGroups";
import { useMemo } from "react";
import CheckboxGroup from "@/globals/components/shared/CheckboxGroup";
import { toastDanger, toastSuccess } from "@/globals/components/shared/toasts";
import { useAuth } from "@/globals/contexts/AuthContext";

type EventDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<Event>;
  mode: "create" | "edit";
};

/**
 * EventDrawer Component
 *
 * A drawer modal for creating and editing calendar events.
 * Provides form fields for event details including title, location,
 * category, date/time, and group selection.
 *
 * Features:
 * - Create new events with date/time selection
 * - Edit existing events with pre-filled data
 * - Delete events (edit mode only)
 * - Conditional group selection based on category
 * - All-day event support
 */
const EventDrawer = ({
  isOpen,
  onClose,
  initialData,
  mode,
}: EventDrawerProps) => {
  const isEdit = mode === "edit";
  const { user } = useAuth();
  const isOrganizer = user?.role === "ORGANIZER";
  const isAdmin = user?.role === "ADMIN";
  const isOwner = initialData?.createdById === user?.id;

  const { mutateAsync: saveEvent, isPending: isSaving } = useSaveEvent();
  const { mutate: deleteEvent } = useDeleteEvent();
  const { mutateAsync: submitEvent, isPending: isSubmitting } = useSubmitEvent();
  const { mutateAsync: approveEvent, isPending: isApproving } = useApproveEvent();

  // Parse includedGroups from JSON string to array for form population
  const initData = useMemo(
    () =>
      initialData
        ? {
            ...initialData,
            includedGroups: initialData.includedGroups
              ? JSON.parse(initialData.includedGroups)
              : null,
          }
        : undefined,
    [initialData]
  );

  const {
    control,
    handleSubmitRaw,
    resetForm,
    watch,
    formState: { errors },
  } = useEventForm(undefined, initData);

  // Watch form field changes to conditionally render sections
  const allDay = watch("allDay");
  const category = watch("category");

  // TODO: Reset includedGroups when category changes
  // Currently, changing category leaves stale group selections in the UI

  /**
   * Handle drawer close - reset form and close drawer
   */
  const handleDrawerClose = () => {
    resetForm();
    onClose();
  };

  const handleSaveDraft = handleSubmitRaw(async (data) => {
    try {
      await saveEvent(formatEventPayload(data));
      toastSuccess("Event saved", "Draft updated successfully.");
      onClose();
    } catch (error) {
      toastDanger(
        "Save failed",
        error instanceof Error ? error.message : undefined
      );
    }
  });

  const handleSubmitForReview = handleSubmitRaw(async (data) => {
    try {
      const saved = await saveEvent(formatEventPayload(data));
      await submitEvent({ id: saved.id });
      toastSuccess("Event submitted", "Waiting for admin approval.");
      onClose();
    } catch (error) {
      toastDanger(
        "Submission failed",
        error instanceof Error ? error.message : undefined
      );
    }
  });

  const handleApproveNow = handleSubmitRaw(async (data) => {
    try {
      const saved = await saveEvent(formatEventPayload(data));
      await approveEvent({ id: saved.id });
      toastSuccess("Event approved", "The event is now live.");
      onClose();
    } catch (error) {
      toastDanger(
        "Approval failed",
        error instanceof Error ? error.message : undefined
      );
    }
  });

  /**
   * Handle event deletion with confirmation dialog
   */
  const handleDeleteEvent = () => {
    const confirmed = confirm("Are you sure you want to delete this event?");
    if (!confirmed || !initialData?.id) return;

    deleteEvent(initialData.id);
    onClose();
  };

  // Only show group selection for categories that require it
  // (skip for ALL, COLLEGE, SHS which apply to everyone)
  const showIncludedGroups = !(
    category === "ALL" ||
    category === "COLLEGE" ||
    category === "SHS"
  );

  const eventStatus = initialData?.status ?? "DRAFT";
  const isReadOnlyApprovedView =
    isEdit && isOrganizer && !isOwner && eventStatus === "APPROVED";
  const canSubmit = isOrganizer && eventStatus === "DRAFT";
  const canApprove = isAdmin && (eventStatus === "DRAFT" || eventStatus === "PENDING");
  const isBusy = isSaving || isSubmitting || isApproving;

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      direction="right"
    >
      <DrawerContent>
        <form
          onSubmit={(event) => {
            if (isReadOnlyApprovedView) {
              event.preventDefault();
              return;
            }

            void handleSaveDraft(event);
          }}
          className="h-full w-full overflow-y-auto bg-white"
        >
          <DrawerHeader>
            <DrawerTitle className="text-center text-2xl">
              {isEdit ? "Edit Event" : "Create Event"}
            </DrawerTitle>
            {isReadOnlyApprovedView ? (
              <p className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-center text-sm text-indigo-700">
                Approved event (view only). Only the event creator or an admin
                can edit this event.
              </p>
            ) : null}
          </DrawerHeader>

          {/* Main form content */}
          <fieldset
            disabled={isReadOnlyApprovedView}
            className={`px-4 flex flex-col gap-3 pb-24 ${
              isReadOnlyApprovedView ? "opacity-80" : ""
            }`}
          >
            {/* Event Title Field */}
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

            {/* Event Location Field */}
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

            {/* Event Category Field */}
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

            {/* Conditional Group Selection */}
            {showIncludedGroups && (
              <div>
                <Label className="text-md mb-1">Included Groups</Label>
                <Controller
                  name="includedGroups"
                  control={control}
                  render={({ field }) => (
                    <>
                      {field.value && (
                        <CheckboxGroup
                          choices={CATEGORY_GROUPS[category].map(
                            (c) => c.value
                          )}
                          placeholder={`Selected ${category.toLowerCase()}s`}
                          selectedValues={field.value}
                          onSelect={(v) => field.onChange(v)}
                        />
                      )}
                    </>
                  )}
                />
                {errors.includedGroups && (
                  <p className="text-sm text-red-500">
                    {errors.includedGroups.message}
                  </p>
                )}
              </div>
            )}

            {/* Schedule Section */}
            <div>
              <p className="text-md font-medium mb-2">Schedule</p>
              <div className="w-full rounded-xl flex flex-col gap-2">
                {/* All Day Toggle */}
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

                {/* Start Date/Time */}
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

                {/* End Date/Time */}
                <Controller
                  name="end"
                  control={control}
                  render={({ field }) => (
                    <>
                      <DateTimeForm
                        date={field.value}
                        onDateTimeChange={field.onChange}
                        label="End"
                        allDay={allDay}
                      />
                      {errors.end && (
                        <p className="text-sm text-red-500">
                          {errors.end.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            {/* Event Description Field */}
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
                    value={field.value ?? ""}
                  />
                )}
              />
            </div>
          </fieldset>

          {/* Action Buttons Footer */}
          <DrawerFooter className="absolute w-full bottom-0 flex flex-row justify-between items-center bg-white">
            {isReadOnlyApprovedView ? (
              <div className="flex w-full items-center justify-between gap-3">
                <p className="text-sm text-slate-500">View-only event details.</p>
                <DrawerClose asChild>
                  <Button type="button" variant="destructive" onClick={handleDrawerClose}>
                    Close
                  </Button>
                </DrawerClose>
              </div>
            ) : (
              <>
                {/* Delete button in edit mode, empty placeholder in create mode */}
                {isEdit ? (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteEvent}
                    disabled={isBusy}
                  >
                    Delete
                  </Button>
                ) : (
                  <div></div>
                )}

                {/* Close and Save buttons */}
                <div className="h-8 flex items-center gap-4">
                  <DrawerClose asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDrawerClose}
                      disabled={isBusy}
                    >
                      Close
                    </Button>
                  </DrawerClose>
                  {canSubmit ? (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleSubmitForReview}
                      disabled={isBusy}
                    >
                      {isSubmitting ? "Submitting..." : "Submit for review"}
                    </Button>
                  ) : null}
                  {canApprove ? (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleApproveNow}
                      disabled={isBusy}
                    >
                      {isApproving ? "Approving..." : "Approve now"}
                    </Button>
                  ) : null}
                  <Button type="submit" variant="default" disabled={isBusy}>
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </>
            )}
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default EventDrawer;
