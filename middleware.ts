import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Define public paths that don't require authentication
const PUBLIC_PATHS = [
  "/",
  "/inventory/wishlist",
  "/api/auth",
  "/_next",
  "/favicon.ico",
]

// Check if a path is public
function isPublicPath(pathname: string): boolean {
  // Exact match for root
  if (pathname === "/") return true
  // Prefix match for other public paths
  return PUBLIC_PATHS.filter(p => p !== "/").some(path => pathname.startsWith(path))
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
  
  // If no token (not authenticated), redirect to wishlist (public page)
  if (!token) {
    const publicUrl = new URL("/inventory/wishlist", request.url)
    return NextResponse.redirect(publicUrl)
  }
  
  // If authenticated, allow access (both admin and regular users can access internal pages)
  // No role restriction needed for authenticated users
  
  // Admin user - allow access
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