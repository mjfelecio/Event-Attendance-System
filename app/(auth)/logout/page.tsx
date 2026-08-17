"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/globals/components/shad-cn/button";
import AuthStatusScreen from "@/features/auth/components/AuthStatusScreen";
import { useAuth } from "@/globals/contexts/AuthContext";

const LogoutPage = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const [failed, setFailed] = useState(false);
  const inFlightRef = useRef(false);

  const attemptLogout = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setFailed(false);

    const ok = await logout();
    inFlightRef.current = false;

    if (ok) {
      router.replace("/login");
    } else {
      setFailed(true);
    }
  }, [logout, router]);

  useEffect(() => {
    attemptLogout();
  }, [attemptLogout]);

  if (failed) {
    return (
      <AuthStatusScreen
        variant="error"
        title="Couldn't sign you out"
        message="Please check your connection and try again."
        action={
          <Button className="mt-1" onClick={() => void attemptLogout()}>
            Retry
          </Button>
        }
      />
    );
  }

  return <AuthStatusScreen message="Signing you out…" />;
};

export default LogoutPage;
