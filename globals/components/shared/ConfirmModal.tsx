import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/globals/components/shad-cn/dialog";
import { Button } from "@/globals/components/shad-cn/button";

interface ConfirmDialogProps {
  title?: string;
  description?: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
}

/**
 * ConfirmDialog
 *
 * The presentational half of the confirmation system. It is already mounted
 * once at the app root by `ConfirmProvider`.
 *
 * ## You almost certainly want `useConfirm()` instead
 *
 * Don't render this directly. Call the hook, which returns a promise resolving
 * to the user's answer and reuses the single root-level instance:
 *
 * ```tsx
 * const confirm = useConfirm();
 *
 * const handleDelete = async () => {
 *   const confirmed = await confirm({
 *     title: "Delete this student?",
 *     description: "All data from this student will be removed.",
 *   });
 *   if (!confirmed) return;
 *   await deleteStudent(id);
 * };
 * ```
 *
 * ## Constraints
 * - **Every irreversible action in this app must go through `useConfirm()`.**
 *   This is the one UI convention with no exceptions; skipping it is the
 *   easiest way to cause accidental attendance-data loss.
 * - The confirm button is always styled destructive. If you need a
 *   non-destructive confirmation, that's a Dialog, not this.
 *
 * @see globals/contexts/ConfirmModalContext.tsx — the `useConfirm` hook
 * @see /design-system — live example
 */
export function ConfirmDialog({
  title = "Confirm",
  description = "Are you sure?",
  isOpen,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isConfirming = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isConfirming}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
