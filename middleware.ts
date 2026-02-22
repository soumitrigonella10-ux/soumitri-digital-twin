import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { getPublicTopicSlugs } from "@/data/topics"
import { config as appConfig } from "@/lib/config"

// Static public paths from centralized config
const STATIC_PUBLIC_PATHS = appConfig.routing.staticPublicPaths;

// Derived from the single source of truth in src/data/topics.ts
const PUBLIC_TOPIC_SLUGS = getPublicTopicSlugs()

// ========================================
// Rate limiting for magic link endpoint (#7)
// In-memory map — resets on cold start. Sufficient for a single-allowed-email
// app; for multi-tenant use, swap for a Redis/KV-backed counter.
// ========================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;            // max 5 attempts per window

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();

  // Evict expired entries when the map grows large
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap) {
      if (now > val.resetTime) rateLimitMap.delete(key);
    }
  }

  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - entry.count };
}

// ========================================
// Content Security Policy — nonce-based in production (#5)
// Dev keeps unsafe-inline/unsafe-eval for HMR; production uses a per-request
// nonce so we no longer ship unsafe-eval to real users.
// ========================================
const isDev = process.env.NODE_ENV === "development";

function buildCspHeader(nonce: string): string {
  if (isDev) {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https: ws:",      // ws: needed for HMR WebSocket
      "worker-src 'self' blob: https://cdnjs.cloudflare.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");
  }

  // Production: nonce-based — no unsafe-eval
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://cdnjs.cloudflare.com`,
    "style-src 'self' 'unsafe-inline'",  // Tailwind needs inline styles
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "worker-src 'self' blob: https://cdnjs.cloudflare.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

// ========================================
// Path helpers
// ========================================
function isPublicPath(pathname: string): boolean {
  // Exact match for root
  if (pathname === "/") return true

  // Static public paths (prefix match)
  if (STATIC_PUBLIC_PATHS.filter(p => p !== "/").some(path => pathname.startsWith(path))) {
    return true
  }

  // Public topic pages (exact match on /slug)
  const topLevelSlug = pathname.split("/")[1]
  if (topLevelSlug && PUBLIC_TOPIC_SLUGS.includes(topLevelSlug)) {
    return true
  }

  // Private topic pages require authentication — do NOT bypass.
  // These will fall through to the JWT check below.

  return false
}

// ========================================
// Middleware
// ========================================
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Rate limiting for magic link sign-in ──
  if (pathname.startsWith("/api/auth/signin")) {
    if (request.method === "POST") {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown";
      const { allowed, remaining } = checkRateLimit(ip);

      if (!allowed) {
        return NextResponse.json(
          { error: "Too many sign-in attempts. Please try again later." },
          {
            status: 429,
            headers: {
              "Retry-After": String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)),
              "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
              "X-RateLimit-Remaining": "0",
            },
          }
        );
      }

      const response = NextResponse.next();
      response.headers.set("X-RateLimit-Limit", String(RATE_LIMIT_MAX_REQUESTS));
      response.headers.set("X-RateLimit-Remaining", String(remaining));
      return response;
    }
    // GET requests to auth signin pass through without rate limiting
    return NextResponse.next();
  }

  // ── Generate CSP nonce ──
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = buildCspHeader(nonce);

  // Pass nonce to server components via request header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  try {
    // Allow public paths without authentication
    if (isPublicPath(pathname)) {
      const response = NextResponse.next({ request: { headers: requestHeaders } });
      response.headers.set("Content-Security-Policy", cspHeader);
      return response;
    }

    // Get the JWT token from the request
    // Fail loudly if NEXTAUTH_SECRET is missing — empty string silently degrades auth
    const secret = process.env.NEXTAUTH_SECRET
    if (!secret) {
      console.error("[Middleware] NEXTAUTH_SECRET is not set — cannot verify JWT")
      const loginUrl = new URL("/auth/signin", request.url)
      loginUrl.searchParams.set("next", pathname)
      return NextResponse.redirect(loginUrl)
    }

    const token = await getToken({
      req: request,
      secret,
    })

    // If no token (not authenticated), redirect to login with next param
    if (!token) {
      const loginUrl = new URL("/auth/signin", request.url)
      loginUrl.searchParams.set("next", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Authenticated — allow access with CSP headers
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set("Content-Security-Policy", cspHeader);
    return response;
  } catch (error) {
    // If middleware fails (e.g. JWT verification, malformed URL),
    // fail CLOSED — redirect to sign-in rather than allowing
    // unauthenticated access.  A fail-open catch would let an
    // attacker bypass auth by triggering an exception.
    console.error("[Middleware] Error processing request:", error)
    const loginUrl = new URL("/auth/signin", request.url)
    return NextResponse.redirect(loginUrl)
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication API routes — except signin, see below)
     * - api/pdf (PDF API sets its own headers)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    "/((?!api/auth|api/pdf|_next/static|_next/image|images|favicon.ico|public).*)",
    // Rate-limit magic link sign-in endpoint
    "/api/auth/signin/:path*",
  ],
}