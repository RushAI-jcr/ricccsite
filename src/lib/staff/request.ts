import { headers } from "next/headers";

export async function getClientIp(): Promise<string> {
  const hdrs = await headers();
  return hdrs.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
}
