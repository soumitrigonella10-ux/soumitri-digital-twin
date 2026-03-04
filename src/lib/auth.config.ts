// ========================================
// Auth Configuration — Edge-compatible subset
//
// This file contains ONLY the Auth.js v5 config that is safe to
// import in the Edge Runtime (middleware). It deliberately excludes:
//   - The Nodemailer provider (depends on Node.js 'stream')
//   - The database adapter (depends on Node.js 'pg')
//   - The logger (may depend on Node.js APIs)
//
// The full auth.ts re-uses this config and adds the provider + adapter.
//
// See: https://authjs.dev/getting-started/migrating-to-v5#edge-compatibility
// ========================================

import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

// ========================================
// Security: Email allowlisting is handled in the full auth.ts.
// Only admin-check helpers are needed here (for JWT callback).
// ========================================

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
// Edge-safe Auth.js config (no providers / adapter)
// ========================================
export const authConfig: NextAuthConfig = {
  providers: [], // Providers added in the full auth.ts
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  callbacks: {
    // NOTE: signIn callback is intentionally NOT here.
    // The full auth.ts overrides it with runtime ALLOWED_EMAIL checks.
    // Keeping it here with a module-load-time value would be fragile.
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

    // authorized() is called by the middleware wrapper from NextAuth().
    // Return true for public paths, false to redirect to signIn page.
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const pathname = nextUrl.pathname;

      // Always allow auth-related paths
      if (pathname.startsWith("/api/auth") || pathname.startsWith("/auth/signin")) {
        return true;
      }

      // Allow public static assets
      if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
        return true;
      }

      // For all other paths, require authentication
      return isLoggedIn;
    },
  },
};

// Lightweight NextAuth instance for middleware (JWT verification only)
export const { auth: middlewareAuth } = NextAuth(authConfig);
