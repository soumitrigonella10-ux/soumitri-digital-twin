// ========================================
// NextAuth API Route Handler
//
// Auth configuration is in src/lib/auth.ts so it can be reused
// with getServerSession(authOptions) in other server components/routes.
// ========================================

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };