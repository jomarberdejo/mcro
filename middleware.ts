import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";

const protectedRoutes = ["/admin"];

const authRoutes = ["/"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) => pathname === route);

  let isAuthenticated = false;
  if (token) {
    const payload = await verifyAuth(token);
    isAuthenticated = !!payload;
  }

  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL("/", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && isAuthenticated) {
    const redirect = request.nextUrl.searchParams.get("redirect");
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