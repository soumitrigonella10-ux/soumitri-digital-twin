// ─────────────────────────────────────────────────────────────
// useAdmin — client-side admin detection hook
//
// Returns { isAdmin } based on the current session role.
// All pages inside AuthenticatedLayout can use this.
// ─────────────────────────────────────────────────────────────
"use client";

import { useSession } from "next-auth/react";

export function useAdmin() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";
  return { isAdmin, session };
}
