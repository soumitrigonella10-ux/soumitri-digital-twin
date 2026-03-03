import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { middlewareAuth } from "@/lib/auth.config"
import { getPublicTopicSlugs } from "@/data/topics"
import { config as appConfig } from "@/lib/config"

// Static public paths from centralized config
const STATIC_PUBLIC_PATHS = appConfig.routing.staticPublicPaths;

// Derived from the single source of truth in src/data/topics.ts
const PUBLIC_TOPIC_SLUGS = getPublicTopicSlugs()

// ========================================
// Rate limiting for magic link endpoint (#7)
//
// ⚠ LIMITATION: In-memory — resets on every cold start and is not
// shared across serverless function instances. An attacker could
// bypass by triggering concurrent cold starts. This is acceptable
// for a single-allowed-email personal app where the email allowlist
// is the real security boundary.
//
// To scale beyond single-user:
//   1. Replace this Map with Vercel KV (Redis) or Upstash via
//      `@upstash/ratelimit` (sliding-window, no cold-start gaps).
//   2. Or use Next.js Edge Config for a lightweight counter.
// ========================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;            // max 5 attempts per window

// ========================================
// General API rate limiting (#rate-limit-api)
//
// Same in-memory approach as auth rate limiting above.
// More permissive: 60 requests per minute per IP.
// Covers all /api/* routes except auth (which has its own stricter limit).
// ========================================
const apiRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const API_RATE_LIMIT_WINDOW_MS = 60 * 1000;   // 1 minute
const API_RATE_LIMIT_MAX_REQUESTS = 60;       // max 60 requests per window

function checkApiRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();

  if (apiRateLimitMap.size > 2000) {
    for (const [key, val] of apiRateLimitMap) {
      if (now > val.resetTime) apiRateLimitMap.delete(key);
    }
  }

  const entry = apiRateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    apiRateLimitMap.set(ip, { count: 1, resetTime: now + API_RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: API_RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (entry.count >= API_RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: API_RATE_LIMIT_MAX_REQUESTS - entry.count };
}

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

  // ── General API rate limiting ──
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const { allowed, remaining } = checkApiRateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(API_RATE_LIMIT_WINDOW_MS / 1000)),
            "X-RateLimit-Limit": String(API_RATE_LIMIT_MAX_REQUESTS),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // Attach rate-limit headers — they will be merged into the final
    // response by the downstream auth/CSP logic below.
    request.headers.set("x-api-rl-remaining", String(remaining));
  }

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

  // ── Generate CSP nonce (skip crypto work in dev — CSP uses unsafe-inline) ──
  const nonce = isDev ? "dev" : Buffer.from(crypto.randomUUID()).toString("base64");
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

    // Get the session using Auth.js v5 (edge-safe, no nodemailer)
    const session = await middlewareAuth();

    // If no session (not authenticated), redirect to login with next param
    if (!session) {
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