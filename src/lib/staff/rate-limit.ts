// In-memory rate limiter — acceptable for login-only use on low-traffic admin panel.
// Note: resets per Vercel Lambda instance (cold starts). Document, don't route around it.
const attempts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, max = 5, windowMs = 15 * 60_000): boolean {
  const now = Date.now();

  // Lazy prune — only runs when Map grows; fine at login-only call frequency
  if (attempts.size > 100) {
    for (const [key, entry] of attempts) {
      if (now > entry.resetAt) attempts.delete(key);
    }
  }

  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}
