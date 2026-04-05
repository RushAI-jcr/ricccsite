type AuditAction =
  | "login_success"
  | "login_failure"
  | "logout"
  | "create"
  | "update"
  | "archive"
  | "restore"
  | "upload";

export function auditLog(
  action: AuditAction,
  ip: string,
  slug?: string,
  extra?: Record<string, unknown>
): void {
  // Server-side only — surfaces in Vercel dashboard logs / Log Drain
  console.log(
    JSON.stringify({
      audit: true,
      action,
      slug,
      ip,
      ts: new Date().toISOString(),
      ...extra,
    })
  );
}
