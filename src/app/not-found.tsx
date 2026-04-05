import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-screen-2xl px-6 lg:px-8 py-24 text-center">
      <h1 className="text-6xl font-bold text-rush-dark-green mb-4">404</h1>
      <p className="text-xl text-rush-on-surface-variant mb-8">
        This page could not be found.
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-sm bg-rush-dark-green px-6 py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity"
      >
        Back to Home
      </Link>
    </main>
  );
}
