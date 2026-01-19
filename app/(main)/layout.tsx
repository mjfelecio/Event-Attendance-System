"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/globals/contexts/SidebarContext";
import Sidebar from "@/globals/components/shared/Sidebar";
import { useAuth } from "@/globals/contexts/AuthContext";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
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

  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar />
        {children}
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
