import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/overview", "/access-control", "/master-data", "/financial", "/settings"];
const authRoutes = [
  "/signin",
  "/signup",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/oauth/callback",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  if (isProtected && !accessToken) {
    const response = NextResponse.redirect(new URL("/signin", request.url));
    // Prevent browser from caching protected pages
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    return response;
  }

  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/overview/dashboard", request.url));
  }

  // Add no-cache headers to all protected pages
  if (isProtected && accessToken) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/overview/:path*",
    "/access-control/:path*",
    "/master-data/:path*",
    "/financial/:path*",
    "/settings/:path*",
    "/signin",
    "/signup",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/oauth/callback",
  ],
};
