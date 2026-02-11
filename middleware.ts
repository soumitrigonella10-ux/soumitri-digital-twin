import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Static public paths (always accessible)
const STATIC_PUBLIC_PATHS = [
  "/",
  "/inventory/wishlist",
  "/api/auth",
  "/_next",
  "/favicon.ico",
]

// Public topic slugs — topics where isPublic === true
// Keep in sync with src/data/topics.ts
const PUBLIC_TOPIC_SLUGS = [
  "wishlist",
  "art-i-made",
  "pop-culture-lore",
  "watchlist",
  "reading-list",
  "food",
  "art-i-want-to-inhale",
]

// Private topic slugs — allow access but with preview query param
const PRIVATE_TOPIC_SLUGS = [
  "sidequests",
  "essays",
  "skills-i-want-to-learn",
  "sam-philosophy",
  "cities-im-curious-about",
]

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
  if (PUBLIC_TOPIC_SLUGS.includes(topLevelSlug)) {
    return true
  }

  // Private topic pages — allow access (page handles preview mode)
  if (PRIVATE_TOPIC_SLUGS.includes(topLevelSlug)) {
    return true
  }

  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public paths without authentication
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }
  
  // Get the JWT token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  
  // If no token (not authenticated), redirect to login with next param
  if (!token) {
    const loginUrl = new URL("/auth/signin", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Authenticated — allow access
  return NextResponse.next()
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