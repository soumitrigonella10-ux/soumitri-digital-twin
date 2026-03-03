// ========================================
// Auth.js v5 Route Handler
//
// Re-exports the GET/POST handlers created by NextAuth() in src/lib/auth.ts.
// ========================================

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;