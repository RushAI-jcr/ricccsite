import Image from "next/image";
import { siteConfig } from "@/lib/config";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rush-green via-rush-forest to-rush-teal text-white">
      {/* Decorative subtle glow */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-rush-emerald/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              {siteConfig.fullName}
            </h1>
            <p className="text-xl text-white/80 mb-6 leading-relaxed">
              {siteConfig.tagline}
            </p>

            {/* CLIF callout */}
            {siteConfig.links.clif && (
              <a
                href={siteConfig.links.clif}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm text-rush-emerald hover:text-white transition-colors duration-300"
              >
                Founding member of the CLIF Consortium
                <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </a>
            )}
          </div>

          {/* Lab logo / hero image */}
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/images/riccc-logo-final.png"
              alt={`${siteConfig.name} logo`}
              width={400}
              height={400}
              className="rounded-2xl shadow-2xl shadow-black/20 animate-float"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
