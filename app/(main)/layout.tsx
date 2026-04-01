"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/globals/contexts/SidebarContext";
import Sidebar from "@/globals/components/shared/Sidebar";
import { useAuth } from "@/globals/contexts/AuthContext";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-600">
        Checking access…
      </main>
    );
  }

  if (!user) {
    return null;
  }

  if (user.status !== "ACTIVE") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-slate-100 text-slate-700 p-6">
        <div className="max-w-md w-full rounded-2xl bg-white shadow-lg border border-slate-200 p-8 space-y-4 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            {user.status === "PENDING"
              ? "Awaiting Approval"
              : "Account Access Restricted"}
          </h1>
          <p className="text-sm text-slate-600">
            {user.status === "PENDING"
              ? "Your organizer account is pending admin approval. You will gain access once an administrator reviews your request."
              : user.rejectionReason ||
                "This account has been rejected. Please contact an administrator for assistance."}
          </p>
          <button
            type="button"
            className="w-full rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            onClick={async () => {
              await logout();
              router.replace("/login");
            }}
          >
            Return to login
          </button>
        </div>
      </main>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <main className="min-h-screen flex-1 overflow-x-hidden">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
