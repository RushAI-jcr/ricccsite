import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
      <h1 className="text-6xl font-bold text-rush-green mb-4">404</h1>
      <p className="text-xl text-rush-mid-gray mb-8">
        This page could not be found.
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-lg bg-rush-teal px-6 py-3 text-sm font-medium text-white hover:bg-rush-green transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
