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
import { pool, resolvePostgresUrl } from "@/lib/db";
import { createLogger } from "@/lib/logger";
import { authConfig } from "@/lib/auth.config";

import type { NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";

const log = createLogger("auth");

// ========================================
// Security: Email allowlisting
// ========================================
function getAllowedEmail(): string | null {
  const raw = process.env.ALLOWED_EMAIL;
  if (!raw || !raw.trim()) {
    log.error("❌ ALLOWED_EMAIL environment variable is not set! Sign-in will be blocked for everyone.");
    return null;
  }
  return raw.trim().toLowerCase();
}

function isAllowedEmail(email: string): boolean {
  const allowed = getAllowedEmail();
  if (!allowed) return false;
  return email.trim().toLowerCase() === allowed;
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
  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

  const pgUrl = resolvePostgresUrl();
  if (pgUrl) {
    if (!pool) {
      // In production, NEVER fall back to JsonAdapter — it uses fs which is
      // read-only on Vercel. Throw a clear error so Auth.js returns
      // Configuration to the client instead of crashing opaquely.
      if (isProd) {
        log.error(
          "❌ Postgres URL found but pool failed to initialize. " +
          "Cannot fall back to JSON adapter in production (read-only filesystem). " +
          "Check DB connection string and SSL settings."
        );
        // Return an adapter whose methods all throw a clear error.
        // Auth.js requires an adapter object — we can't return null.
        const fail = (method: string) => {
          const msg = `DB pool unavailable — ${method} cannot run. Check Postgres URL and DB_SSL_REJECT_UNAUTHORIZED env vars.`;
          log.error(msg);
          throw new Error(msg);
        };
        return {
          createUser: () => fail("createUser"),
          getUser: () => fail("getUser"),
          getUserByEmail: () => fail("getUserByEmail"),
          getUserByAccount: () => fail("getUserByAccount"),
          updateUser: () => fail("updateUser"),
          deleteUser: () => fail("deleteUser"),
          linkAccount: () => fail("linkAccount"),
          unlinkAccount: () => fail("unlinkAccount"),
          createSession: () => fail("createSession"),
          getSessionAndUser: () => fail("getSessionAndUser"),
          updateSession: () => fail("updateSession"),
          deleteSession: () => fail("deleteSession"),
          createVerificationToken: () => fail("createVerificationToken"),
          useVerificationToken: () => fail("useVerificationToken"),
        } as ReturnType<typeof CustomPgAdapter>;
      }
      log.error(
        "\u26a0\ufe0f Postgres URL found but pool failed to initialize"
      );
      log.info(
        "Falling back to JSON adapter due to pool initialization failure"
      );
      return JsonAdapter();
    }
    log.info("Using PostgreSQL adapter");
    // Wrap the adapter to surface connection failures clearly
    const pgAdapter = CustomPgAdapter(pool);
    return {
      ...pgAdapter,
      // getUserByEmail is called BEFORE the signIn callback in Auth.js.
      // If it throws, Auth.js maps it to a generic "Configuration" error.
      // Wrap it so we get a clear log line in production.
      async getUserByEmail(
        ...args: Parameters<NonNullable<typeof pgAdapter.getUserByEmail>>
      ) {
        try {
          return await pgAdapter.getUserByEmail!(...args);
        } catch (err) {
          log.error("❌ getUserByEmail failed — is the DB reachable?", err);
          throw err;
        }
      },
      async createVerificationToken(
        ...args: Parameters<NonNullable<typeof pgAdapter.createVerificationToken>>
      ) {
        try {
          return await pgAdapter.createVerificationToken!(...args);
        } catch (err) {
          log.error("❌ createVerificationToken failed — is the DB reachable?", err);
          throw err;
        }
      },
    };
  }

  if (isProd) {
    log.error(
      "❌ No Postgres URL found in production. " +
      "Email sign-in requires a database for verification tokens. " +
      "Set POSTGRES_URL (or DATABASE_URL / DATABASE_URL_POSTGRES_URL_NON_POOLING) in your Vercel environment variables."
    );
  }
  log.info("\u26a0\ufe0f No Postgres URL \u2014 using local JSON adapter");
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

              // Fail fast with a clear message if SMTP env vars are missing
              if (!process.env.EMAIL_SERVER_HOST || !process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
                log.error("⚠️ Cannot send magic link — missing SMTP env vars (EMAIL_SERVER_HOST / EMAIL_SERVER_USER / EMAIL_SERVER_PASSWORD)");
                throw new Error("Email transport is not configured");
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
      // Always log at error level so this appears in production
      log.error("[next-auth]", error.message, error.stack);
    },
    warn(code: string) {
      // Promote to error in production for visibility
      log.error("[next-auth:warn]", code);
    },
    debug(message: string, metadata?: unknown) {
      log.info("[next-auth:debug]", message, metadata);
    },
  },
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      const allowed = getAllowedEmail();
      const incoming = user?.email?.trim().toLowerCase() ?? null;

      if (!incoming) {
        log.error(`⛔ signIn rejected — no email on user object (raw: ${JSON.stringify(user?.email)})`);
        return false;
      }
      if (!allowed) {
        log.error(`⛔ signIn rejected — ALLOWED_EMAIL env var is missing or empty (raw: ${JSON.stringify(process.env.ALLOWED_EMAIL)}, incoming: ${incoming})`);
        return false;
      }
      if (incoming !== allowed) {
        log.error(`⛔ signIn rejected — email mismatch: incoming="${incoming}" allowed="${allowed}" (raw env: ${JSON.stringify(process.env.ALLOWED_EMAIL)})`);
        return false;
      }

      log.info(`✅ signIn allowed for ${incoming}`);
      return true;
    },
  },
};

export const { handlers, auth, signIn: serverSignIn, signOut: serverSignOut } = NextAuth(fullAuthConfig);
