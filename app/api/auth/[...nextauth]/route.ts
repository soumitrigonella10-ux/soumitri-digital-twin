import NextAuth, { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import CustomPgAdapter from "@/lib/pg-adapter"
import { JsonAdapter } from "@/lib/json-adapter"
import { pool } from "@/lib/db"

function getAdminEmails(): string[] {
  const adminEmailsEnv = process.env.ADMIN_EMAILS
  if (!adminEmailsEnv) return []
  return adminEmailsEnv.split(',').map(email => email.trim().toLowerCase())
}

function isAdmin(email: string): boolean {
  const adminEmails = getAdminEmails()
  return adminEmails.includes(email.toLowerCase())
}

// Validate critical environment variables
function validateEnvironment() {
  const issues: string[] = []
  
  if (!process.env.NEXTAUTH_SECRET) {
    issues.push("NEXTAUTH_SECRET is not set")
  }
  
  if (!process.env.NEXTAUTH_URL) {
    issues.push("NEXTAUTH_URL is not set")
  }
  
  if (process.env.DEMO_MODE !== "true") {
    if (!process.env.EMAIL_SERVER_HOST) issues.push("EMAIL_SERVER_HOST is not set")
    if (!process.env.EMAIL_SERVER_USER) issues.push("EMAIL_SERVER_USER is not set")
    if (!process.env.EMAIL_SERVER_PASSWORD) issues.push("EMAIL_SERVER_PASSWORD is not set")
  }
  
  if (issues.length > 0) {
    console.error("[auth] ⚠️ Environment validation failed:")
    issues.forEach(issue => console.error(`  - ${issue}`))
  }
  
  return issues.length === 0
}

// Validate on startup
const envValid = validateEnvironment()
if (!envValid) {
  console.warn("[auth] ⚠️ Sign-in may fail due to missing environment variables")
}

// Use PostgreSQL adapter in production (when POSTGRES_URL is set), otherwise fall back to JSON adapter
function getAdapter() {
  if (process.env.POSTGRES_URL) {
    if (!pool) {
      console.error("[auth] ⚠️ POSTGRES_URL is set but pool failed to initialize")
      console.log("[auth] Falling back to JSON adapter due to pool initialization failure")
      return JsonAdapter()
    }
    console.log("[auth] Using PostgreSQL adapter")
    return CustomPgAdapter(pool)
  }
  console.log("[auth] ⚠️ No POSTGRES_URL — using local JSON adapter")
  return JsonAdapter()
}

const authOptions: NextAuthOptions = {
  adapter: getAdapter(),
  providers: [
    EmailProvider({
      server: process.env.DEMO_MODE === "true" ? "" : {
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
      sendVerificationRequest: process.env.DEMO_MODE === "true"
        ? ({ identifier, url }) => {
            // Demo mode: log magic links to console
            console.log("\n🚀 DEMO MODE - Magic Link Generated:");
            console.log("📧 Email:", identifier);
            console.log("🔗 Magic Link:", url);
            console.log("👆 Copy this URL and paste it in your browser to sign in\n");
            return Promise.resolve();
          }
        : async (params) => {
            // Production: send email via nodemailer
            try {
              const { identifier, url, provider } = params
              console.log(`[auth] Sending magic link to ${identifier}`)
              const nodemailer = await import('nodemailer')
              const transport = nodemailer.createTransport(provider.server)
              await transport.sendMail({
                to: identifier,
                from: provider.from,
                subject: "Sign in to your account",
                text: `Sign in to your account: ${url}`,
                html: `<p>Click <a href="${url}">here</a> to sign in</p>`,
              })
              console.log(`[auth] ✅ Magic link sent to ${identifier}`)
            } catch (error) {
              console.error("[auth] ❌ Failed to send magic link email:", error)
              throw error
            }
          },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",  // Redirect errors to sign-in page instead of raw 500
  },
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      console.error("[next-auth][error]", code, JSON.stringify(metadata, null, 2))
    },
    warn(code) {
      console.warn("[next-auth][warn]", code)
    },
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
    async redirect({ url: _url, baseUrl }) {
      // Always redirect to today page (/) after sign-in
      return `${baseUrl}/`
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }