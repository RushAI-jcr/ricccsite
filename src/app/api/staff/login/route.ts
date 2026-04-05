import { NextRequest, NextResponse } from "next/server";
import { getSession, verifyPassphrase } from "@/lib/staff/auth";
import { checkOrigin } from "@/lib/staff/csrf";
import { checkRateLimit } from "@/lib/staff/rate-limit";
import { auditLog } from "@/lib/staff/audit";
import { getClientIp } from "@/lib/staff/request";

export async function POST(req: NextRequest) {
  const csrfError = checkOrigin(req);
  if (csrfError) return csrfError;

  const ip = await getClientIp();

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
