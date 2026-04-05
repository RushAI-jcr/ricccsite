import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function Hero() {
  return (
    <section className="relative px-6 lg:px-8 py-24 md:py-32 max-w-screen-2xl mx-auto pt-32 md:pt-40">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: 8 cols */}
        <div className="lg:col-span-8">
          <p className="font-mono text-xs uppercase tracking-widest text-rush-teal mb-6">
            Established {siteConfig.metrics.founded} &bull; Rush University
          </p>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-rush-dark-green leading-[1.1] mb-8">
            {siteConfig.fullName}
          </h1>

          <p className="text-xl text-rush-on-surface-variant max-w-2xl leading-relaxed mb-10">
            {siteConfig.tagline}
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Link
              href="/mission"
              className="bg-rush-dark-green text-white px-8 py-4 rounded-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Explore Our Mission
            </Link>
            <Link
              href="/publications"
              className="border border-rush-outline-variant text-rush-dark-green px-8 py-4 rounded-sm font-semibold hover:bg-rush-surface-container transition-colors"
            >
              View Publications
            </Link>
          </div>
        </div>

        {/* Right: 4 cols */}
        <div className="lg:col-span-4">
          <div className="aspect-[3/4] rounded-sm overflow-hidden shadow-2xl bg-rush-surface-container">
            <Image
              src="/images/riccc-logo-final.png"
              alt={`${siteConfig.name} logo`}
              width={600}
              height={800}
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
