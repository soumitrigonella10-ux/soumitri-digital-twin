// ========================================
// Sentry — Server-side Configuration
// Initialises Node.js error & performance monitoring for
// API routes, server components, and server actions.
// Docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/
// ========================================

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // ── Sampling ──────────────────────────────────────────────
  sampleRate: 1.0,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,

  // ── Environment / Release ─────────────────────────────────
  environment: process.env.NODE_ENV ?? "development",

  // ── Privacy ───────────────────────────────────────────────
  sendDefaultPii: false,

  // ── Debug ─────────────────────────────────────────────────
  debug: false,
});
