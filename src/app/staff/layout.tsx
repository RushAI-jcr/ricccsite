"use client";

import { usePathname, useRouter } from "next/navigation";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/staff/login";

  async function handleLogout() {
    await fetch("/api/staff/logout", { method: "POST" });
    router.push("/staff/login");
  }

  return (
    <div className="min-h-screen bg-rush-surface-container-low">
      {!isLogin && (
        <header className="bg-rush-dark-green text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-white/60">RICCC</span>
            <span className="text-white/40">·</span>
            <span className="font-semibold text-sm">Staff Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/staff/members"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Members
            </a>
            <button
              onClick={handleLogout}
              className="text-white/50 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors"
            >
              Sign out
            </button>
          </div>
        </header>
      )}
      <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
