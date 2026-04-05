import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

interface AdminSessionData {
  authenticated?: boolean;
}

export const sessionOptions = {
  password: process.env.SESSION_SECRET ?? "dev-secret-change-in-production-32chars",
  cookieName: "riccc_admin_session",
  ttl: 60 * 60 * 8, // 8 hours
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/staff",
  },
};

export async function getSession(): Promise<IronSession<AdminSessionData>> {
  return getIronSession<AdminSessionData>(await cookies(), sessionOptions);
}

// Returns a 403 response if not authenticated, null if OK
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getSession();
  if (!session.authenticated) {
    return NextResponse.json(
      { error: "forbidden", message: "Not authenticated" },
      { status: 403 }
    );
  }
  return null;
}

export function verifyPassphrase(input: string): boolean {
  const expected = process.env.ADMIN_PASSPHRASE;
  if (!expected) return false;
  // Hash both to equal lengths before timingSafeEqual
  const bufA = createHash("sha256").update(input).digest();
  const bufB = createHash("sha256").update(expected).digest();
  return timingSafeEqual(bufA, bufB);
}
