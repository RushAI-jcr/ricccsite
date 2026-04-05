import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getSession } from "@/lib/staff/auth";
import { auditLog } from "@/lib/staff/audit";

export async function POST() {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

  const session = await getSession();
  session.destroy();

  auditLog("logout", ip);
  return NextResponse.json({ ok: true });
}
