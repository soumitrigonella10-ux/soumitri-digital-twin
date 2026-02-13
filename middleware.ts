import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { getPublicTopicSlugs, getPrivateTopicSlugs } from "@/data/topics"

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
const PRIVATE_TOPIC_SLUGS = getPrivateTopicSlugs()

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

  // Private topic pages — allow access (page handles preview mode)
  if (topLevelSlug && PRIVATE_TOPIC_SLUGS.includes(topLevelSlug)) {
    return true
  }

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
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET ?? "",
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