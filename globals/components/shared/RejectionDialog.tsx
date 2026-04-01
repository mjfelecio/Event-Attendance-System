"use client";

import { Button } from "@/globals/components/shad-cn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/globals/components/shad-cn/dialog";
import { Label } from "@/globals/components/shad-cn/label";
import { Textarea } from "@/globals/components/shad-cn/textarea";

type RejectionDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  reason: string;
  onReasonChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  reasonLabel?: string;
  placeholder?: string;
};

const RejectionDialog = ({
  isOpen,
  title,
  description,
  reason,
  onReasonChange,
  onCancel,
  onConfirm,
  isSubmitting = false,
  confirmLabel = "Reject",
  cancelLabel = "Cancel",
  reasonLabel = "Reason",
  placeholder = "Provide a clear rejection reason",
}: RejectionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="rejection-reason">{reasonLabel}</Label>
          <Textarea
            id="rejection-reason"
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            placeholder={placeholder}
            className="min-h-24 resize-none"
          />
          <p className="text-xs text-slate-500">
            This message will be shown to the organizer.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectionDialog;
