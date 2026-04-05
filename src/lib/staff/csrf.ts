import { NextRequest, NextResponse } from "next/server";

// Origin check — combined with sameSite: strict cookie this is a complete CSRF defense
// for a same-origin admin panel (OWASP 2025 guidance).
export function checkOrigin(req: NextRequest): NextResponse | null {
  const origin = req.headers.get("origin");
  if (!origin) return null; // absent Origin = same-origin browser request or curl, allow

  const proto = process.env.NODE_ENV === "production" ? "https" : "http";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${req.headers.get("host")}`;
  if (origin !== siteUrl) {
    return NextResponse.json(
      { error: "forbidden", message: "Cross-origin request rejected" },
      { status: 403 }
    );
  }
  return null;
}
