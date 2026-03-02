// ─────────────────────────────────────────────────────────────
// Admin Auth Guard — Server-side session + role validation
//
// Every CMS mutation MUST call requireAdmin() before doing any work.
// This is the single chokepoint for authorization, never bypassed.
// ─────────────────────────────────────────────────────────────
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createLogger } from "@/lib/logger";

const log = createLogger("cms-auth");

export interface AdminSession {
  email: string;
  role: "admin";
}

/**
 * Validates the current server session and asserts admin role.
 * Throws a descriptive error if:
 *   - No session exists (unauthenticated)
 *   - Session user has no email
 *   - User role is not "admin"
 *
 * Returns the validated admin session for audit logging.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    log.warn("⛔ CMS mutation attempted without authentication");
    throw new Error("Authentication required");
  }

  const role = (session.user as { role?: string }).role;

  if (role !== "admin") {
    log.warn(`⛔ CMS mutation attempted by non-admin: ${session.user.email} (role: ${role})`);
    throw new Error("Admin access required");
  }

  log.info(`✅ Admin authenticated: ${session.user.email}`);

  return {
    email: session.user.email,
    role: "admin",
  };
}

/**
 * Check if the current session is an admin without throwing.
 * Useful for conditional rendering in server components.
 */
export async function isAdminSession(): Promise<boolean> {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}
