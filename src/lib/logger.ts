// ========================================
// Logger Utility
//
// Thin wrapper around console methods that:
// - Suppresses info/debug in production to keep logs clean
// - Prefixes every message with a [module] tag
// - Silences the no-console ESLint rule in one place
//
// Usage:
//   import { createLogger } from "@/lib/logger";
//   const log = createLogger("auth");
//   log.info("Using PostgreSQL adapter");   // → [auth] Using PostgreSQL adapter
//   log.error("Pool failed:", err);         // → [auth] Pool failed: …
// ========================================

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// In production, only warn and above are emitted
const MIN_LEVEL: LogLevel =
  process.env.NODE_ENV === "production" ? "warn" : "debug";

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[MIN_LEVEL];
}

/**
 * Create a namespaced logger.
 *
 * @example
 *   const log = createLogger("auth");
 *   log.info("Using PostgreSQL adapter");   // → [auth] Using PostgreSQL adapter
 *   log.error("Pool failed:", err);         // → [auth] Pool failed: …
 */
export function createLogger(module: string) {
  const tag = `[${module}]`;

  return {
    /** Verbose output — development only */
    debug(...args: unknown[]) {
      if (shouldLog("debug")) {
        // eslint-disable-next-line no-console
        console.debug(tag, ...args);
      }
    },

    /** General informational messages — suppressed in production */
    info(...args: unknown[]) {
      if (shouldLog("info")) {
        // eslint-disable-next-line no-console
        console.log(tag, ...args);
      }
    },

    /** Warnings — always logged */
    warn(...args: unknown[]) {
      if (shouldLog("warn")) {
        // eslint-disable-next-line no-console
        console.warn(tag, ...args);
      }
    },

    /** Errors — always logged */
    error(...args: unknown[]) {
      // eslint-disable-next-line no-console
      console.error(tag, ...args);
    },
  };
}
