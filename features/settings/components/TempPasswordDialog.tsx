"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/globals/components/shad-cn/dialog";
import { Button } from "@/globals/components/shad-cn/button";
import { Alert, AlertDescription } from "@/globals/components/shad-cn/alert";
import { toastDanger } from "@/globals/components/shared/toasts";
import type { TemporaryPasswordResult } from "@/globals/hooks/useAdmin";

type Props = {
  result: TemporaryPasswordResult | null;
  onClose: () => void;
};

/** Shows a freshly issued temporary password. It is not retrievable again. */
const TempPasswordDialog = ({ result, onClose }: Props) => {
  const [hasCopied, setHasCopied] = useState(false);

  if (!result) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.temporaryPassword);
      setHasCopied(true);
    } catch {
      // Clipboard access is blocked over plain HTTP on some browsers, which is
      // exactly how this app is deployed - say so instead of failing silently.
      toastDanger(
        "Couldn't copy",
        "Copy the password manually from the box above.",
      );
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Temporary password for {result.name}</DialogTitle>
          <DialogDescription>
            Give this to {result.email}. They will be asked to choose their own
            password the next time they sign in.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <code className="flex-1 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-lg tracking-wider text-slate-900">
            {result.temporaryPassword}
          </code>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Copy temporary password"
            onClick={handleCopy}
          >
            {hasCopied ? (
              <Check className="size-4 text-emerald-600" />
            ) : (
              <Copy className="size-4" />
            )}
          </Button>
        </div>

        <Alert>
          <AlertDescription>
            This is the only time it is shown. If it is lost, reset the password
            again.
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <Button type="button" onClick={onClose}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TempPasswordDialog;
