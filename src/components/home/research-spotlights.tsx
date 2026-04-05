import Image from "next/image";
import { ExternalLink } from "lucide-react";
import spotlightData from "../../../content/spotlights.json";
import { isValidDoi, isValidPmid } from "@/lib/url";

interface Spotlight {
  title: string;
  journal: string;
  year: string;
  authors: string;
  doi?: string;
  pmid?: string;
  image?: string;
}

export function ResearchSpotlights() {
  const spotlights: Spotlight[] = spotlightData.spotlights ?? [];

  if (spotlights.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        <h2 className="text-3xl font-bold text-rush-dark-green mb-2">
          Research Spotlights
        </h2>
        <p className="text-xl text-rush-on-surface-variant mb-10 max-w-2xl">
          Recent publications from the lab.
        </p>

        <div className="space-y-6">
          {spotlights.map((pub) => {
            const href = pub.doi && isValidDoi(pub.doi)
              ? `https://doi.org/${pub.doi}`
              : pub.pmid && isValidPmid(pub.pmid)
              ? `https://pubmed.ncbi.nlm.nih.gov/${pub.pmid}/`
              : undefined;

            const Wrapper = href ? "a" : "div";
            const linkProps = href
              ? { href, target: "_blank" as const, rel: "noopener noreferrer" }
              : {};

            return (
              <Wrapper
                key={pub.title}
                {...linkProps}
                className="group block bg-rush-surface rounded-sm shadow-card hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Key figure image (if provided) */}
                  {pub.image && (
                    <div className="md:w-72 shrink-0 bg-rush-surface-container-high">
                      <Image
                        src={pub.image}
                        alt={`Key figure from ${pub.title}`}
                        width={288}
                        height={200}
                        sizes="(max-width: 768px) 100vw, 288px"
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Paper details */}
                  <div className="flex-1 p-6">
                    {/* Journal badge */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center bg-rush-dark-green text-white font-mono text-xs uppercase px-3 py-1 tracking-widest">
                        {pub.journal}
                      </span>
                      <span className="text-sm text-rush-on-surface-variant">{pub.year}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-rush-on-surface mb-3 group-hover:text-rush-dark-green transition-colors leading-snug">
                      {pub.title}
                    </h3>

                    {/* Authors */}
                    <p className="text-sm text-rush-on-surface-variant mb-4 leading-relaxed">
                      {pub.authors}
                    </p>

                    {/* DOI link */}
                    {href && (
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-rush-teal group-hover:underline">
                        Read paper <ExternalLink className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
