import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected paths — all /staff/* except the login page itself, and all /api/staff/* routes
const PUBLIC_STAFF_PATHS = ["/staff/login", "/api/staff/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only run on /staff/* and /api/staff/*
  if (!pathname.startsWith("/staff") && !pathname.startsWith("/api/staff")) {
    return NextResponse.next();
  }

  // Allow the login page and any static assets
  if (PUBLIC_STAFF_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Read the session cookie — synchronous NextRequest.cookies (NOT await cookies())
  const session = request.cookies.get("riccc_admin_session");

  if (!session?.value) {
    // API routes → 403 JSON; Pages → redirect to login
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "forbidden", message: "Not authenticated" },
        { status: 403 }
      );
    }
    const loginUrl = new URL("/staff/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/staff/:path*", "/api/staff/:path*"],
};
