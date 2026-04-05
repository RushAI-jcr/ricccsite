"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawReturnTo = searchParams.get("returnTo") ?? "/staff/members";
  const returnTo = rawReturnTo.startsWith("/staff") ? rawReturnTo : "/staff/members";

  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase }),
      });

      if (res.ok) {
        router.push(returnTo);
      } else {
        const data = await res.json().catch(() => ({}));
        if (res.status === 429) {
          setError("Too many attempts. Please wait 15 minutes and try again.");
        } else {
          setError(data.message ?? "Incorrect passphrase");
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="passphrase" className="block text-sm font-medium text-rush-on-surface mb-1">
          Passphrase
        </label>
        <input
          id="passphrase"
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full px-4 py-3 border border-rush-outline-variant/40 rounded-sm bg-white text-rush-on-surface focus:outline-none focus:ring-2 focus:ring-rush-teal"
          placeholder="Enter staff passphrase"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !passphrase}
        className="w-full bg-rush-dark-green text-white py-3 rounded-sm font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
