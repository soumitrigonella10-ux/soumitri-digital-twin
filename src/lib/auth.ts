// ========================================
// Auth Configuration — Shared NextAuth Options
//
// Extracted from the API route so authOptions can be reused in:
// - API route handler (app/api/auth/[...nextauth]/route.ts)
// - Server components via getServerSession(authOptions)
// - Other API routes that need session access
//
// This follows Next.js best practice for NextAuth v4:
// https://next-auth.js.org/configuration/nextauth#in-app-router
// ========================================

import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CustomPgAdapter from "@/lib/pg-adapter";
import { JsonAdapter } from "@/lib/json-adapter";
import { pool } from "@/lib/db";

// ========================================
// Security: Email allowlisting
// ========================================
const ALLOWED_EMAIL = "soumitri.gonella10@gmail.com";

function isAllowedEmail(email: string): boolean {
  return email.toLowerCase() === ALLOWED_EMAIL.toLowerCase();
}

function getAdminEmails(): string[] {
  const adminEmailsEnv = process.env.ADMIN_EMAILS;
  if (!adminEmailsEnv) return [];
  return adminEmailsEnv
    .split(",")
    .map((email) => email.trim().toLowerCase());
}

function isAdmin(email: string): boolean {
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
}

// ========================================
// Environment validation
// ========================================
function validateEnvironment() {
  const issues: string[] = [];

  if (!process.env.NEXTAUTH_SECRET) {
    issues.push("NEXTAUTH_SECRET is not set");
  }

  if (!process.env.NEXTAUTH_URL) {
    issues.push("NEXTAUTH_URL is not set");
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
    console.error("[auth] ⚠️ Environment validation failed:");
    issues.forEach((issue) => console.error(`  - ${issue}`));
  }

  return issues.length === 0;
}

// Validate on module load
const envValid = validateEnvironment();
if (!envValid) {
  console.warn(
    "[auth] ⚠️ Sign-in may fail due to missing environment variables"
  );
}

// ========================================
// Adapter selection
// ========================================
function getAdapter() {
  if (process.env.POSTGRES_URL) {
    if (!pool) {
      console.error(
        "[auth] ⚠️ POSTGRES_URL is set but pool failed to initialize"
      );
      console.log(
        "[auth] Falling back to JSON adapter due to pool initialization failure"
      );
      return JsonAdapter();
    }
    console.log("[auth] Using PostgreSQL adapter");
    return CustomPgAdapter(pool);
  }
  console.log("[auth] ⚠️ No POSTGRES_URL — using local JSON adapter");
  return JsonAdapter();
}

// ========================================
// Exported auth configuration
// ========================================
export const authOptions: NextAuthOptions = {
  adapter: getAdapter(),
  providers: [
    EmailProvider({
      server:
        process.env.DEMO_MODE === "true"
          ? ""
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
                console.warn(
                  `[auth] ⛔ Blocked magic link request from unauthorized email: ${identifier}`
                );
                throw new Error("This email is not authorized to sign in");
              }
              console.log("\n🚀 DEMO MODE - Magic Link Generated:");
              console.log("📧 Email:", identifier);
              console.log("🔗 Magic Link:", url);
              console.log(
                "👆 Copy this URL and paste it in your browser to sign in\n"
              );
              return Promise.resolve();
            }
          : async (params) => {
              const { identifier, url, provider } = params;

              if (!isAllowedEmail(identifier)) {
                console.warn(
                  `[auth] ⛔ Blocked magic link email to unauthorized address: ${identifier}`
                );
                throw new Error("This email is not authorized to sign in");
              }

              try {
                console.log(`[auth] Sending magic link to ${identifier}`);
                const nodemailer = await import("nodemailer");
                const transport = nodemailer.createTransport(provider.server);
                await transport.sendMail({
                  to: identifier,
                  from: provider.from,
                  subject: "Sign in to your account",
                  text: `Sign in to your account: ${url}`,
                  html: `<p>Click <a href="${url}">here</a> to sign in</p>`,
                });
                console.log(`[auth] ✅ Magic link sent to ${identifier}`);
              } catch (error) {
                console.error(
                  "[auth] ❌ Failed to send magic link email:",
                  error
                );
                throw error;
              }
            },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      console.error(
        "[next-auth][error]",
        code,
        JSON.stringify(metadata, null, 2)
      );
    },
    warn(code) {
      console.warn("[next-auth][warn]", code);
    },
  },
  callbacks: {
    async signIn({ user }) {
      if (!user?.email || !isAllowedEmail(user.email)) {
        console.warn(
          `[auth] ⛔ Blocked sign-in attempt from: ${user?.email || "unknown"}`
        );
        return false;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
        token.role = isAdmin(user.email) ? "admin" : "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.email) {
        session.user = {
          ...session.user,
          email: token.email as string,
          role: token.role as "admin" | "user",
        };
      }
      return session;
    },
    async redirect({ url: _url, baseUrl }) {
      return `${baseUrl}/`;
    },
  },
};
