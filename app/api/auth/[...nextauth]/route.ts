// ========================================
// Auth.js v5 Route Handler
//
// Re-exports the GET/POST handlers created by NextAuth() in src/lib/auth.ts.
//
// The POST handler eagerly reads the request body and reconstructs a
// fresh Request before handing it to Auth.js. This prevents the body
// stream from being consumed by middleware (e.g. Sentry auto-
// instrumentation) or by next-auth's `reqWithEnvURL` (which creates
// a new NextRequest from the original, potentially losing the body on
// Next.js 15).
// ========================================

import { handlers } from "@/lib/auth";
import { NextRequest } from "next/server";

export const GET = handlers.GET;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const preserved = new NextRequest(req.url, {
    method: req.method,
    headers: req.headers,
    body,
  });
  return handlers.POST(preserved);
}