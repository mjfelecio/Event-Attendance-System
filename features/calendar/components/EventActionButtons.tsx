"use client";

import { Button } from "@/globals/components/shad-cn/button";
import { DrawerClose, DrawerFooter } from "@/globals/components/shad-cn/drawer";
import { Loader2, Trash2 } from "lucide-react";

type ActionButtonProps = {
  isEdit: boolean;
  isReadOnlyView: boolean;
  isReadOnlyPendingView: boolean;
  canSubmit: boolean;
  canApprove: boolean;
  isBusy: boolean;
  isDeleting: boolean;
  isSaving: boolean;
  isSubmitting: boolean;
  isApproving: boolean;
  hasId: boolean;
  onClose: () => void;
  onDelete: () => void;
  onSubmitForReview: () => void;
  onApproveNow: () => void;
};

export default function EventActionButtons({
  isEdit, isReadOnlyView, isReadOnlyPendingView, canSubmit, canApprove,
  isBusy, isDeleting, isSaving, isSubmitting, isApproving, hasId,
  onClose, onDelete, onSubmitForReview, onApproveNow
}: ActionButtonProps) {
  
  if (isReadOnlyView) {
    return (
      <DrawerFooter className="w-full border-t border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="flex w-full items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            {isReadOnlyPendingView ? "Pending events are view-only until reviewed by an admin." : "View-only event details."}
          </p>
          <DrawerClose asChild>
            <Button type="button" variant="outline" onClick={onClose}>Close</Button>
          </DrawerClose>
        </div>
      </DrawerFooter>
    );
  }

  return (
    <DrawerFooter className="w-full border-t border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="grid w-full gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Delete Button */}
          {isEdit && hasId && (
            <Button
              type="button" variant="outline"
              className="h-10 border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
              onClick={onDelete} disabled={isBusy}
            >
              <Trash2 className="size-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          )}

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <DrawerClose asChild>
              <Button type="button" variant="outline" onClick={onClose} disabled={isBusy}>
                Close
              </Button>
            </DrawerClose>

            {/* Submit for Review */}
            {canSubmit && (
              <Button type="button" variant="secondary" onClick={onSubmitForReview} disabled={isBusy}>
                {isSubmitting ? <><Loader2 className="size-4 mr-2 animate-spin" />Submitting...</> : "Submit for review"}
              </Button>
            )}

            {/* Approve Now */}
            {canApprove && (
              <Button type="button" variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200" onClick={onApproveNow} disabled={isBusy}>
                {isApproving ? <><Loader2 className="size-4 mr-2 animate-spin" />Approving...</> : "Approve now"}
              </Button>
            )}
          </div>
        </div>

        {/* Primary Save Button (Triggers standard form submit) */}
        <Button type="submit" className="h-11 w-full bg-slate-900 text-white" disabled={isBusy}>
          {isSaving ? <><Loader2 className="size-4 mr-2 animate-spin" />Saving...</> : (isEdit ? "Save changes" : "Save draft")}
        </Button>
      </div>
    </DrawerFooter>
  );
}