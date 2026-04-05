import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getSession, verifyPassphrase } from "@/lib/staff/auth";
import { checkRateLimit } from "@/lib/staff/rate-limit";
import { auditLog } from "@/lib/staff/audit";

export async function POST(req: NextRequest) {
  // Get client IP for rate limiting
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

  // Rate limit: 5 attempts / 15 min per IP
  if (!checkRateLimit(ip)) {
    auditLog("login_failure", ip, undefined, { reason: "rate_limited" });
    return NextResponse.json(
      { error: "too_many_requests", message: "Too many login attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { passphrase } = body as { passphrase?: string };

  if (!passphrase || !verifyPassphrase(passphrase)) {
    auditLog("login_failure", ip);
    return NextResponse.json(
      { error: "unauthorized", message: "Incorrect passphrase" },
      { status: 401 }
    );
  }

  // Set iron-session cookie
  const session = await getSession();
  session.authenticated = true;
  await session.save();

  auditLog("login_success", ip);
  return NextResponse.json({ ok: true });
}
