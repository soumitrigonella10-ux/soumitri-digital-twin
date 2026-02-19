// ========================================
// Application Configuration
//
// Centralized, typed configuration that consolidates all magic numbers,
// feature flags, and environment-dependent settings into one module.
//
// Usage:
//   import { config } from "@/lib/config";
//   const ttl = config.cache.TTL;
//   const isDemo = config.auth.isDemoMode;
// ========================================

// ========================================
// Environment helpers
// ========================================
const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";
const isDemo = process.env.DEMO_MODE === "true";

// ========================================
// Application configuration
// ========================================
export const config = {
  /** Environment flags */
  env: {
    isDev,
    isProd,
    isDemo,
  },

  /** Authentication settings */
  auth: {
    isDemoMode: isDemo,
    sessionMaxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    magicLinkMaxAge: 10 * 60, // 10 minutes in seconds
    allowedEmail: "soumitri.gonella10@gmail.com",
  },

  /** Database settings */
  db: {
    maxPoolSize: 3,
    idleTimeoutMs: 30_000,
    connectionTimeoutMs: 20_000, // Increased for Neon cold starts
  },

  /** Client-side performance */
  performance: {
    debounceDelay: 300,
    animationDuration: 200,
    lazyLoadThreshold: 50,
    cacheTTL: 5 * 60 * 1000, // 5 minutes in ms
  },

  /** Store persistence */
  store: {
    persistKey: "routines-wardrobe-app",
    persistVersion: 2,
    staleCompletionDays: 30,
  },

  /** Middleware & routing */
  routing: {
    /** Static paths that are always public (no auth required) */
    staticPublicPaths: [
      "/",
      "/archive",
      "/consumption",
      "/travel-log",
      "/skills",
      "/artifacts",
      "/design-theology",
      "/inspiration",
      "/inventory/wishlist",
      "/api/auth",
      "/auth/signin",
      "/_next",
      "/favicon.ico",
    ],
  },
} as const;

/** Type of the full config object for consumers that need it */
export type AppConfig = typeof config;
