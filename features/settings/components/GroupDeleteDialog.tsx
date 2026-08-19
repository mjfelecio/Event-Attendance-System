"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/globals/components/shad-cn/dialog";
import { Button } from "@/globals/components/shad-cn/button";
import { Label } from "@/globals/components/shad-cn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/globals/components/shad-cn/select";
import StatusBadge, {
  EVENT_STATUS_TONE,
} from "@/globals/components/shared/StatusBadge";
import type { ManagedGroup } from "@/globals/hooks/useGroups";

/** Sentinel for "no replacement" — Radix's Select cannot hold an empty value. */
const UNASSIGNED = "__unassigned__";

type Props = {
  group: ManagedGroup | null;
  /** Every other group, used to offer same-category replacements. */
  allGroups: ManagedGroup[];
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: (reassignToGroupId: string | null) => void;
};

/**
 * Collects where a deleted group's students should go, and refuses outright
 * while any event still targets the group.
 *
 * This dialog gathers the decision only — the caller still routes the actual
 * delete through `useConfirm()`, which is mandatory for irreversible actions.
 */
const GroupDeleteDialog = ({
  group,
  allGroups,
  isDeleting,
  onCancel,
  onConfirm,
}: Props) => {
  const [target, setTarget] = useState<string>(UNASSIGNED);

  useEffect(() => {
    setTarget(UNASSIGNED);
  }, [group?.id]);

  if (!group) return null;

  const isBlocked = group.events.length > 0;
  const replacements = allGroups.filter(
    (candidate) =>
      candidate.id !== group.id && candidate.category === group.category,
  );

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete &ldquo;{group.name}&rdquo;?</DialogTitle>
          <DialogDescription>
            {isBlocked
              ? "This group is still targeted by one or more events."
              : `${group.studentCount} student(s) belong to this group.`}
          </DialogDescription>
        </DialogHeader>

        {isBlocked ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-amber-800">
              <AlertTriangle className="size-4" />
              Retarget these events first
            </p>
            <ul className="mt-3 space-y-2">
              {group.events.map((event) => (
                <li
                  key={event.id}
                  className="flex items-center justify-between gap-3 text-sm text-amber-900"
                >
                  <span className="truncate">{event.title}</span>
                  <StatusBadge tone={EVENT_STATUS_TONE[event.status]}>
                    {event.status}
                  </StatusBadge>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-amber-700">
              Deleting it would silently change who those events are for.
            </p>
          </div>
        ) : group.studentCount > 0 ? (
          <div className="space-y-2">
            <Label htmlFor="reassign-target">Move their members to</Label>
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger id="reassign-target" className="w-full rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value={UNASSIGNED}>
                  Leave them unassigned
                </SelectItem>
                {replacements.map((candidate) => (
                  <SelectItem key={candidate.id} value={candidate.id}>
                    {candidate.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">
              {target === UNASSIGNED
                ? `${group.studentCount} student(s) will have no ${group.category.toLowerCase()} until one is set. Their roster row will show a dash.`
                : `${group.studentCount} student(s) will be moved.`}
            </p>
          </div>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isBlocked || isDeleting}
            onClick={() => onConfirm(target === UNASSIGNED ? null : target)}
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete group"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupDeleteDialog;
