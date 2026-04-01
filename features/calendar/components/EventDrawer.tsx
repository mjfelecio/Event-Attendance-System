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
import { Controller, type FieldErrors } from "react-hook-form";
import {
  type EventForm,
  formatEventPayload,
  useEventForm,
} from "@/features/calendar/hooks/useEventForm";
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
import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import CheckboxGroup from "@/globals/components/shared/CheckboxGroup";
import { toastDanger, toastSuccess } from "@/globals/components/shared/toasts";
import { useAuth } from "@/globals/contexts/AuthContext";
import { ConfirmDialog } from "@/globals/components/shared/ConfirmModal";

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
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const formScrollRef = useRef<HTMLDivElement | null>(null);

  const { mutateAsync: saveEvent, isPending: isSaving } = useSaveEvent();
  const { mutateAsync: deleteEvent, isPending: isDeleting } = useDeleteEvent();
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
    clearErrors,
    resetForm,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useEventForm(undefined, initData);

  // Watch form field changes to conditionally render sections
  const allDay = watch("allDay");
  const category = watch("category");
  const includedGroups = watch("includedGroups");
  const startDate = watch("start");
  const endDate = watch("end");

  useEffect(() => {
    if (!category) return;

    const categoriesWithoutGroups = ["ALL", "COLLEGE", "SHS"];
    const skipGroups = categoriesWithoutGroups.includes(category);
    const currentGroups = includedGroups ?? [];

    if (skipGroups) {
      // Only update form state when we actually have values to clear.
      if (currentGroups.length > 0) {
        setValue("includedGroups", [], { shouldValidate: false, shouldDirty: false });
      }

      if (errors.includedGroups) {
        clearErrors("includedGroups");
      }

      return;
    }

    const allowedGroupValues = new Set(
      CATEGORY_GROUPS[category].map((choice) => choice.value)
    );
    const validGroups = currentGroups.filter((group) =>
      allowedGroupValues.has(group)
    );

    const groupsChanged =
      currentGroups.length !== validGroups.length ||
      currentGroups.some((group, index) => group !== validGroups[index]);

    if (groupsChanged) {
      setValue("includedGroups", validGroups, { shouldValidate: true, shouldDirty: false });
    }
  }, [category, includedGroups, clearErrors, errors.includedGroups, setValue]);

  useEffect(() => {
    if (allDay || !startDate || !endDate) return;

    if (endDate.getTime() >= startDate.getTime()) {
      if (errors.end) {
        clearErrors("end");
      }
      return;
    }

    const correctedEnd = new Date(startDate.getTime() + 60 * 60 * 1000);
    setValue("end", correctedEnd, { shouldValidate: true, shouldDirty: false });
    clearErrors("end");
  }, [allDay, startDate, endDate, clearErrors, errors.end, setValue]);

  /**
   * Handle drawer close - reset form and close drawer
   */
  const handleDrawerClose = () => {
    setIsDeleteConfirmOpen(false);
    resetForm();
    onClose();
  };

  const handleInvalidSubmit = (fieldErrors: FieldErrors<EventForm>) => {
    const description =
      fieldErrors.title?.message?.toString() ||
      fieldErrors.category?.message?.toString() ||
      fieldErrors.includedGroups?.message?.toString() ||
      fieldErrors.start?.message?.toString() ||
      fieldErrors.end?.message?.toString() ||
      (Object.keys(fieldErrors).length > 0
        ? `Please check: ${Object.keys(fieldErrors)[0]}`
        : "Please review the required fields.");

    toastDanger("Can't save event yet", description);
    formScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveDraft = handleSubmitRaw(
    async (data) => {
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
    },
    handleInvalidSubmit
  );

  const handleSubmitForReview = handleSubmitRaw(
    async (data) => {
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
    },
    handleInvalidSubmit
  );

  const handleApproveNow = handleSubmitRaw(
    async (data) => {
      try {
        const existingId = initialData?.id;
        const isDirectApprovalOnExistingEvent =
          isEdit &&
          !!existingId &&
          !isDirty &&
          (eventStatus === "PENDING" || eventStatus === "REJECTED");

        const eventId = isDirectApprovalOnExistingEvent
          ? existingId
          : (await saveEvent(formatEventPayload(data))).id;

        await approveEvent({ id: eventId });
        toastSuccess("Event approved", "The event is now live.");
        onClose();
      } catch (error) {
        toastDanger(
          "Approval failed",
          error instanceof Error ? error.message : undefined
        );
      }
    },
    handleInvalidSubmit
  );

  /**
   * Handle event deletion with confirmation dialog
   */
  const handleDeleteEvent = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!initialData?.id) {
      setIsDeleteConfirmOpen(false);
      return;
    }

    try {
      await deleteEvent(initialData.id);
      toastSuccess("Event deleted", "The event has been removed.");
      handleDrawerClose();
    } catch (error) {
      toastDanger(
        "Delete failed",
        error instanceof Error ? error.message : undefined
      );
    } finally {
      setIsDeleteConfirmOpen(false);
    }
  };

  // Only show group selection for categories that require it
  // (skip for ALL, COLLEGE, SHS which apply to everyone)
  const showIncludedGroups = !!category && !(
    category === "ALL" ||
    category === "COLLEGE" ||
    category === "SHS"
  );

  const eventStatus = initialData?.status ?? "DRAFT";
  const isReadOnlyApprovedView =
    isEdit && isOrganizer && !isOwner && eventStatus === "APPROVED";
  const isReadOnlyPendingView =
    isEdit && isOrganizer && eventStatus === "PENDING";
  const isReadOnlyView = isReadOnlyApprovedView || isReadOnlyPendingView;
  const canSubmit = isOrganizer && eventStatus === "DRAFT";
  const canApprove =
    isAdmin &&
    (eventStatus === "DRAFT" ||
      eventStatus === "PENDING" ||
      eventStatus === "REJECTED");
  const isBusy = isSaving || isSubmitting || isApproving || isDeleting;
  const saveLabel = isEdit ? "Save changes" : "Save draft";

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => !open && handleDrawerClose()}
      direction="right"
    >
      <DrawerContent className="border-l border-slate-200/80 bg-white shadow-[-18px_0_42px_rgba(15,23,42,0.18)] data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:max-w-[480px]">
        <form
          onSubmit={(event) => {
            if (isReadOnlyView) {
              event.preventDefault();
              return;
            }

            void handleSaveDraft(event);
          }}
          className="flex h-full w-full flex-col bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]"
        >
          <DrawerHeader className="border-b border-slate-200/80 bg-white/95 px-5 py-5 backdrop-blur">
            <DrawerTitle className="text-center text-3xl font-bold tracking-tight text-slate-900">
              {isEdit ? "Edit Event" : "Create Event"}
            </DrawerTitle>
            {isReadOnlyApprovedView ? (
              <p className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-center text-sm text-indigo-700">
                Approved event (view only). Only the event creator or an admin
                can edit this event.
              </p>
            ) : isReadOnlyPendingView ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center text-sm text-amber-700">
                This event is pending admin review. Editing is temporarily locked.
              </p>
            ) : null}
          </DrawerHeader>

          <div ref={formScrollRef} className="flex-1 overflow-y-auto">
            {/* Main form content */}
            <fieldset
              disabled={isReadOnlyView}
              className={`flex flex-col gap-4 px-5 pb-6 pt-4 ${
                isReadOnlyView ? "opacity-80" : ""
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
                <Label className="mb-1 text-sm font-semibold text-slate-700">
                  Category
                </Label>
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
                  <Label className="mb-1 text-sm font-semibold text-slate-700">
                    Included Groups
                  </Label>
                  <Controller
                    name="includedGroups"
                    control={control}
                    render={({ field }) => (
                      <>
                        {field.value ? (
                          <CheckboxGroup
                            choices={
                              CATEGORY_GROUPS[category]?.map(
                                (choice) => choice.value
                              ) ?? []
                            }
                            placeholder={`Selected ${category.toLowerCase()}s`}
                            selectedValues={field.value}
                            onSelect={(values) => field.onChange(values)}
                          />
                        ) : null}
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
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  Schedule
                </p>
                <div className="flex w-full flex-col gap-2 rounded-xl border border-slate-200/80 bg-white p-3">
                  {/* All Day Toggle */}
                  <div className="flex flex-row items-center gap-3">
                    <p className="text-sm font-medium text-slate-700">All Day</p>
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
                <Label
                  htmlFor="description"
                  className="mb-1 text-sm font-semibold text-slate-700"
                >
                  Description
                </Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      placeholder="Optional description about the event"
                      id="description"
                      className="h-24 resize-none border-slate-300 bg-white"
                      {...field}
                      value={field.value ?? ""}
                    />
                  )}
                />
              </div>
            </fieldset>
          </div>

          {/* Action Buttons Footer */}
          <DrawerFooter className="w-full border-t border-slate-200/80 bg-white/95 backdrop-blur">
            {isReadOnlyView ? (
              <div className="flex w-full items-center justify-between gap-3">
                <p className="text-sm text-slate-500">
                  {isReadOnlyPendingView
                    ? "Pending events are view-only until reviewed by an admin."
                    : "View-only event details."}
                </p>
                <DrawerClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                    onClick={handleDrawerClose}
                  >
                    Close
                  </Button>
                </DrawerClose>
              </div>
            ) : (
              <div className="grid w-full gap-2">
                <p className="text-xs text-slate-500">
                  {canSubmit
                    ? "Save as draft now, then submit for review when ready."
                    : canApprove
                    ? "Save your changes or approve this event now."
                    : "Save your latest changes."}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  {isEdit ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 rounded-xl border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                      onClick={handleDeleteEvent}
                      disabled={isBusy || !initialData?.id}
                    >
                      <Trash2 className="size-4" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  ) : null}

                  <div className="ml-auto flex flex-wrap items-center gap-2">
                    <DrawerClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 rounded-xl border-slate-300 bg-white px-4 text-slate-700 hover:bg-slate-100"
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
                        className="h-10 rounded-xl bg-indigo-100 px-4 text-indigo-700 hover:bg-indigo-200"
                        onClick={handleSubmitForReview}
                        disabled={isBusy}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit for review"
                        )}
                      </Button>
                    ) : null}
                    {canApprove ? (
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-10 rounded-xl bg-emerald-100 px-4 text-emerald-700 hover:bg-emerald-200"
                        onClick={handleApproveNow}
                        disabled={isBusy}
                      >
                        {isApproving ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Approving...
                          </>
                        ) : (
                          "Approve now"
                        )}
                      </Button>
                    ) : null}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="default"
                  className="h-11 w-full rounded-xl bg-slate-900 px-5 text-white shadow-[0_8px_18px_rgba(15,23,42,0.25)] hover:bg-slate-800"
                  disabled={isBusy}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    saveLabel
                  )}
                </Button>
              </div>
            )}
          </DrawerFooter>

          <ConfirmDialog
            title="Delete this event?"
            description="This will permanently remove the event. This action cannot be undone."
            isOpen={isDeleteConfirmOpen}
            onCancel={() => setIsDeleteConfirmOpen(false)}
            onConfirm={() => void handleDeleteConfirm()}
            confirmLabel={isDeleting ? "Deleting..." : "Delete event"}
            cancelLabel="Keep event"
            isConfirming={isDeleting}
          />
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default EventDrawer;
