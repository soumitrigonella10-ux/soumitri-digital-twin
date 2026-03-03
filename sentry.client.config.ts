// ========================================
// Sentry — Client-side Configuration
// Initialises browser error & performance monitoring.
// Docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/
// ========================================

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // ── Sampling ──────────────────────────────────────────────
  // Capture 100 % of errors (adjust when traffic grows)
  sampleRate: 1.0,

  // Performance: sample 20 % of transactions in production
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,

  // Session replay: capture 10 % of sessions,
  // 100 % of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // ── Integrations ──────────────────────────────────────────
  integrations: [
    Sentry.replayIntegration({
      // Mask text & block media by default for privacy
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration(),
  ],

  // ── Environment / Release ─────────────────────────────────
  environment: process.env.NODE_ENV ?? "development",

  // ── Privacy ───────────────────────────────────────────────
  // Strip PII — single-user app but good practice
  sendDefaultPii: false,

  // Only report errors from your own code
  allowUrls: [/https?:\/\/(.*\.)?vercel\.app/],

  // ── Debug ─────────────────────────────────────────────────
  debug: false,
});
