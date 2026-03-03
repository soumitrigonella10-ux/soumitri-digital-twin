// ========================================
// Auth Configuration — Auth.js v5
//
// Single-file setup that exports:
//   handlers  → re-exported in app/api/auth/[...nextauth]/route.ts
//   auth      → server-side session access (replaces getServerSession)
//   signIn    → server action for sign-in
//   signOut   → server action for sign-out
//
// https://authjs.dev/getting-started/migrating-to-v5
// ========================================

import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import CustomPgAdapter from "@/lib/pg-adapter";
import { JsonAdapter } from "@/lib/json-adapter";
import { pool } from "@/lib/db";
import { createLogger } from "@/lib/logger";
import { authConfig } from "@/lib/auth.config";

import type { NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";

const log = createLogger("auth");

// ========================================
// Security: Email allowlisting
// ========================================
const ALLOWED_EMAIL = (() => {
  const email = process.env.ALLOWED_EMAIL;
  if (!email) {
    throw new Error(
      "Missing environment variable ALLOWED_EMAIL — set it to the single email permitted to sign in."
    );
  }
  return email.toLowerCase();
})();

function isAllowedEmail(email: string): boolean {
  return email.toLowerCase() === ALLOWED_EMAIL;
}

// ========================================
// Environment validation
// ========================================
function validateEnvironment() {
  const issues: string[] = [];

  // Auth.js v5 accepts both AUTH_SECRET and NEXTAUTH_SECRET
  if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
    issues.push("AUTH_SECRET (or NEXTAUTH_SECRET) is not set");
  }

  if (process.env.DEMO_MODE !== "true") {
    if (!process.env.EMAIL_SERVER_HOST)
      issues.push("EMAIL_SERVER_HOST is not set");
    if (!process.env.EMAIL_SERVER_USER)
      issues.push("EMAIL_SERVER_USER is not set");
    if (!process.env.EMAIL_SERVER_PASSWORD)
      issues.push("EMAIL_SERVER_PASSWORD is not set");
  }

  if (issues.length > 0) {
    log.error("\u26a0\ufe0f Environment validation failed:");
    issues.forEach((issue) => log.error(`  - ${issue}`));
  }

  return issues.length === 0;
}

// Validate on module load
const envValid = validateEnvironment();
if (!envValid) {
  log.warn(
    "\u26a0\ufe0f Sign-in may fail due to missing environment variables"
  );
}

// ========================================
// Adapter selection
// ========================================
function getAdapter() {
  if (process.env.POSTGRES_URL) {
    if (!pool) {
      log.error(
        "\u26a0\ufe0f POSTGRES_URL is set but pool failed to initialize"
      );
      log.info(
        "Falling back to JSON adapter due to pool initialization failure"
      );
      return JsonAdapter();
    }
    log.info("Using PostgreSQL adapter");
    return CustomPgAdapter(pool);
  }
  log.info("\u26a0\ufe0f No POSTGRES_URL \u2014 using local JSON adapter");
  return JsonAdapter();
}

// ========================================
// Auth.js v5 configuration
// Spreads the edge-safe base config from auth.config.ts and adds
// the Nodemailer provider + DB adapter (Node.js-only).
// ========================================
const fullAuthConfig: NextAuthConfig = {
  ...authConfig,
  adapter: getAdapter(),
  providers: [
    Nodemailer({
      server:
        process.env.DEMO_MODE === "true"
          ? { host: "localhost", port: 25, auth: { user: "", pass: "" } }
          : {
              host: process.env.EMAIL_SERVER_HOST,
              port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
              auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
              },
              secure: false,
            },
      from: process.env.EMAIL_FROM || "demo@example.com",
      maxAge: 10 * 60,
      sendVerificationRequest:
        process.env.DEMO_MODE === "true"
          ? ({ identifier, url }) => {
              if (!isAllowedEmail(identifier)) {
                log.warn(
                  `⛔ Blocked magic link request from unauthorized email: ${identifier}`
                );
                throw new Error("This email is not authorized to sign in");
              }
              log.info("\n🚀 DEMO MODE - Magic Link Generated:");
              log.info("📧 Email:", identifier);
              log.info("🔗 Magic Link:", url);
              log.info(
                "👆 Copy this URL and paste it in your browser to sign in\n"
              );
              return Promise.resolve();
            }
          : async (params) => {
              const { identifier, url, provider } = params;

              if (!isAllowedEmail(identifier)) {
                log.warn(
                  `\u26d4 Blocked magic link email to unauthorized address: ${identifier}`
                );
                throw new Error("This email is not authorized to sign in");
              }

              try {
                log.info(`Sending magic link to ${identifier}`);
                const nodemailer = await import("nodemailer");
                const transport = nodemailer.createTransport(provider.server);
                await transport.sendMail({
                  to: identifier,
                  from: provider.from,
                  subject: "Sign in to your account",
                  text: `Sign in to your account: ${url}`,
                  html: `<p>Click <a href="${url}">here</a> to sign in</p>`,
                });
                log.info(`\u2705 Magic link sent to ${identifier}`);
              } catch (error) {
                log.error(
                  "\u274c Failed to send magic link email:",
                  error
                );
                throw error;
              }
            },
    }) as Provider,
  ],
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(error: Error) {
      log.error("[next-auth]", error.message, error.stack);
    },
    warn(code: string) {
      log.warn("[next-auth]", code);
    },
    debug(message: string, metadata?: unknown) {
      log.info("[next-auth:debug]", message, metadata);
    },
  },
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      if (!user?.email || !isAllowedEmail(user.email)) {
        log.warn(
          `\u26d4 Blocked sign-in attempt from: ${user?.email || "unknown"}`
        );
        return false;
      }
      return true;
    },
  },
};

export const { handlers, auth, signIn: serverSignIn, signOut: serverSignOut } = NextAuth(fullAuthConfig);
