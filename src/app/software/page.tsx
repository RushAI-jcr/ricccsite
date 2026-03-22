import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Software & Tools",
  description: "Open-source tools from the RICCC Lab",
};

export default function SoftwarePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-rush-green mb-4">
        Software & Tools
      </h1>
      <p className="text-rush-mid-gray text-lg">
        Software page coming in Phase 2.
      </p>
    </div>
  );
}
