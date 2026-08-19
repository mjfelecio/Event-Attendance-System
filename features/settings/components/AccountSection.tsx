"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/globals/components/shad-cn/sheet";
import { Button } from "@/globals/components/shad-cn/button";
import StatusBadge, {
  USER_STATUS_TONE,
} from "@/globals/components/shared/StatusBadge";
import { surface, type as typeToken } from "@/globals/constants/designTokens";
import { cn } from "@/globals/libs/shad-cn";
import { useAuth } from "@/globals/contexts/AuthContext";
import ChangePasswordForm from "./ChangePasswordForm";

/** The one settings section every signed-in user can see. */
const AccountSection = () => {
  const { user } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  if (!user) return null;

  return (
    <section className={cn(surface.card, "p-6")}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h2 className={typeToken.sectionTitle}>Account</h2>
          <p className={cn(typeToken.muted, "mt-1")}>
            The account you are signed in with on this device.
          </p>

          <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            <div>
              <dt className="text-[10px] font-bold uppercase text-slate-400">
                Name
              </dt>
              <dd className="mt-0.5 text-sm text-slate-900">{user.name}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[10px] font-bold uppercase text-slate-400">
                Email
              </dt>
              <dd className="mt-0.5 truncate text-sm text-slate-900">
                {user.email}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase text-slate-400">
                Role
              </dt>
              <dd className="mt-1">
                <StatusBadge tone={user.role === "ADMIN" ? "primary" : "neutral"}>
                  {user.role}
                </StatusBadge>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase text-slate-400">
                Status
              </dt>
              <dd className="mt-1">
                <StatusBadge tone={USER_STATUS_TONE[user.status]} withDot>
                  {user.status}
                </StatusBadge>
              </dd>
            </div>
          </dl>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => setIsSheetOpen(true)}
          className="shrink-0"
        >
          <KeyRound className="size-4" />
          Change password
        </Button>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="flex w-full flex-col border-l-slate-200 bg-white p-0 sm:max-w-md">
          <SheetHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
            <SheetTitle className="text-xl font-bold text-slate-800">
              Change password
            </SheetTitle>
            <SheetDescription className="text-sm text-slate-500">
              You stay signed in on this device after changing it.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <ChangePasswordForm onSuccess={() => setIsSheetOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default AccountSection;
