import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/staff/auth";
import { checkOrigin } from "@/lib/staff/csrf";
import { auditLog } from "@/lib/staff/audit";
import { getClientIp } from "@/lib/staff/request";

export async function POST(req: NextRequest) {
  const csrfError = checkOrigin(req);
  if (csrfError) return csrfError;

  const ip = await getClientIp();

  const session = await getSession();
  session.destroy();

  auditLog("logout", ip);
  return NextResponse.json({ ok: true });
}
