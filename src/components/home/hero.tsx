import Image from "next/image";
import { siteConfig } from "@/lib/config";

const goals = [
  {
    title: "ICU Data Science",
    description:
      "Applying machine learning, NLP, and predictive analytics to large-scale ICU datasets to build clinical decision support tools.",
  },
  {
    title: "Federated ICU Research",
    description:
      "Leading multi-center collaborations across 10+ U.S. hospitals through the CLIF Consortium — analyzing care variations without sharing raw patient data.",
  },
  {
    title: "Clinical Trials in ICU",
    description:
      "Designing pragmatic randomized trials and applying causal inference methods to determine which care variations truly affect patient outcomes.",
  },
  {
    title: "Multidisciplinary ICU Research",
    description:
      "Bridging pulmonary medicine, critical care, clinical informatics, biostatistics, and respiratory care to tackle problems no single discipline can solve alone.",
  },
];

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
            <p className="text-lg text-white/80 mb-4 leading-relaxed">
              Critical care generates enormous data — and most of it goes unused
              at the bedside. The RICCC Lab at Rush University Medical Center
              builds the methods, tools, and evidence to change that. Through
              federated research across 10 U.S. hospitals, pragmatic clinical
              trials, and causal inference, we turn ICU data into
              practice-changing insights for critically ill patients.
            </p>

            <p className="text-sm text-rush-emerald mb-8">
              Founding members of the{" "}
              <a
                href={siteConfig.links.clif}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white transition-colors"
              >
                CLIF Consortium
              </a>{" "}
              — a federated network across 10+ U.S. academic medical centers
            </p>

            {/* Research goals */}
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.title}>
                  <h3 className="font-semibold text-sm text-rush-emerald">
                    {goal.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {goal.description}
                  </p>
                </div>
              ))}
            </div>
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
