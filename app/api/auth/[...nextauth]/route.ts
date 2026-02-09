import NextAuth, { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import PostgresAdapter from "@auth/pg-adapter"
import { pool, setupAuthTables } from "@/lib/db"

function getAdminEmails(): string[] {
  const adminEmailsEnv = process.env.ADMIN_EMAILS
  if (!adminEmailsEnv) return []
  return adminEmailsEnv.split(',').map(email => email.trim().toLowerCase())
}

function isAdmin(email: string): boolean {
  const adminEmails = getAdminEmails()
  return adminEmails.includes(email.toLowerCase())
}

const authOptions: NextAuthOptions = {
  adapter: PostgresAdapter(pool),
  providers: [
    EmailProvider({
      server: process.env.DEMO_MODE === "true" ? undefined : {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
        secure: false, // Use STARTTLS
      },
      from: process.env.EMAIL_FROM || "demo@example.com",
      maxAge: 10 * 60, // 10 minutes
      ...(process.env.DEMO_MODE === "true" && {
        // In demo mode, log verification links instead of sending emails
        sendVerificationRequest: ({ identifier, url }) => {
          console.log("\n🚀 DEMO MODE - Magic Link Generated:");
          console.log("📧 Email:", identifier);
          console.log("🔗 Magic Link:", url);
          console.log("👆 Copy this URL and paste it in your browser to sign in\n");
          return Promise.resolve();
        },
      }),
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // When user signs in, add role to token
      if (user?.email) {
        token.email = user.email
        token.role = isAdmin(user.email) ? "admin" : "user"
      }
      
      return token
    },
    async session({ session, token }) {
      // Send properties to the client  
      if (token?.email) {
        session.user = {
          ...session.user,
          email: token.email as string,
          role: token.role as "admin" | "user",
        }
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to today page (/) after sign-in
      return `${baseUrl}/`
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }