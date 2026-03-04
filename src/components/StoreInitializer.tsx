"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

/**
 * StoreInitializer — ensures the Zustand store loads DB data once per session.
 *
 * Mount this in the root layout (inside SessionProvider) so that
 * `initFromDb()` runs regardless of which page the user lands on.
 *
 * `initFromDb()` guards itself (skips if already loading/ready),
 * so calling it multiple times is safe and idempotent.
 */
export function StoreInitializer() {
  const dbStatus = useAppStore((s) => s.dbStatus);
  const initFromDb = useAppStore((s) => s.initFromDb);

  useEffect(() => {
    if (dbStatus === "idle") {
      // eslint-disable-next-line no-console
      console.log("[StoreInitializer] dbStatus is idle — calling initFromDb()");
      initFromDb();
    }
  }, [dbStatus, initFromDb]);

  return null; // Render nothing — this is a side-effect-only component
}
