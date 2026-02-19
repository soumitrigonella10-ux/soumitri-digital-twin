// ========================================
// Authentication Types
// ========================================

import { DefaultSession } from "next-auth";

export type UserRole = "admin" | "user";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
  }
}
