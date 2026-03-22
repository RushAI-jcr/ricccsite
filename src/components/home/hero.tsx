import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function Hero() {
  return (
    <section className="bg-rush-indigo text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              {siteConfig.fullName}
            </h1>
            <p className="text-xl text-white/80 mb-6 leading-relaxed">
              {siteConfig.tagline}
            </p>

            {/* PI intro — Parker Lab style */}
            <div className="flex items-start gap-4 bg-white/10 rounded-lg p-4 mb-6">
              <div className="shrink-0 w-16 h-16 rounded-full bg-rush-deep-blue flex items-center justify-center text-white text-xl font-bold">
                {siteConfig.pi.name.charAt(0) || "PI"}
              </div>
              <div>
                <p className="font-semibold">
                  {siteConfig.pi.name}, {siteConfig.pi.credentials}
                </p>
                <p className="text-white/70 text-sm">{siteConfig.pi.title}</p>
                <p className="text-white/70 text-sm">
                  {siteConfig.institution}
                </p>
              </div>
            </div>

            {/* CLIF callout */}
            {siteConfig.links.clif && (
              <a
                href={siteConfig.links.clif}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-rush-cerulean hover:text-white transition-colors"
              >
                Founding member of the CLIF Consortium &rarr;
              </a>
            )}
          </div>

          {/* Lab logo / hero image */}
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/images/riccc-logo.png"
              alt={`${siteConfig.name} logo`}
              width={400}
              height={400}
              className="rounded-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
