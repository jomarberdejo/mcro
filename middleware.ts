// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";

// Routes that require authentication
const protectedRoutes = ["/admin"];

// Routes that should redirect to admin if already authenticated
const authRoutes = ["/"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route is auth page (root login page)
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  // Verify token if it exists
  let isAuthenticated = false;
  if (token) {
    const payload = await verifyAuth(token);
    isAuthenticated = !!payload;
  }

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL("/", request.url);
    // Save the original URL they were trying to access
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users from login page to intended destination
  if (isAuthRoute && isAuthenticated) {
    // Get the redirect parameter from URL
    const redirect = request.nextUrl.searchParams.get("redirect");
    // Redirect to intended page or default to birth-certificate
    const destination = redirect && redirect.startsWith("/admin") 
      ? redirect 
      : "/admin/birth-certificate";
    const url = new URL(destination, request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public|.*\\..*|_next).*)",
  ],
};