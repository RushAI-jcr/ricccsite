import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/staff/login-form";

export const metadata: Metadata = {
  title: "Staff Login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-rush-surface-container-low px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-rush-dark-green block mb-2">
            RICCC Lab
          </span>
          <h1 className="text-2xl font-bold text-rush-on-surface">Staff Admin</h1>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
