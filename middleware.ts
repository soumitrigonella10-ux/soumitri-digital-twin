import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { getPublicTopicSlugs } from "@/data/topics"

// Static public paths (always accessible)
const STATIC_PUBLIC_PATHS = [
  "/",
  "/inventory/wishlist",
  "/api/auth",
  "/_next",
  "/favicon.ico",
]

// Derived from the single source of truth in src/data/topics.ts
const PUBLIC_TOPIC_SLUGS = getPublicTopicSlugs()

// Check if a path is public
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

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl
    
    // Allow public paths without authentication
    if (isPublicPath(pathname)) {
      return NextResponse.next()
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
    
    // Authenticated — allow access
    return NextResponse.next()
  } catch (error) {
    // If middleware fails (e.g. JWT verification, malformed URL),
    // allow the request through rather than returning a raw 500.
    // The page-level auth check will handle it gracefully.
    console.error("[Middleware] Error processing request:", error)
    return NextResponse.next()
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|images|favicon.ico|public).*)",
  ],
}