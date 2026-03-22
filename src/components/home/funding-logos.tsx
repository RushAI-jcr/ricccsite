import { siteConfig } from "@/lib/config";

export function FundingLogos() {
  return (
    <section className="py-12 border-t border-rush-light-gray">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-rush-mid-gray uppercase tracking-wider">
          Supported by {siteConfig.institution}
        </p>
      </div>
    </section>
  );
}
