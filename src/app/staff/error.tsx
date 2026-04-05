"use client";

export default function StaffError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="py-16 text-center">
      <h2 className="text-xl font-bold text-rush-on-surface mb-2">Something went wrong</h2>
      <p className="text-sm text-rush-on-surface-variant mb-6">
        The admin panel encountered an error. This may be a temporary issue with the GitHub API.
      </p>
      <button
        onClick={reset}
        className="bg-rush-dark-green text-white px-5 py-2.5 rounded-sm text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        Try again
      </button>
    </div>
  );
}
