import Image from "next/image";
import { ExternalLink } from "lucide-react";
import spotlightData from "../../../content/spotlights.json";

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
    <section className="py-16 lg:py-24 bg-rush-sage">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-rush-green mb-2">
          Research Spotlights
        </h2>
        <p className="text-rush-umber mb-10">
          Featured publications from our lab
        </p>

        <div className="space-y-6">
          {spotlights.map((pub) => {
            const href = pub.doi
              ? `https://doi.org/${pub.doi}`
              : pub.pmid
              ? `https://pubmed.ncbi.nlm.nih.gov/${pub.pmid}/`
              : undefined;

            return (
              <a
                key={pub.title}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Key figure image (if provided) */}
                  {pub.image && (
                    <div className="md:w-72 shrink-0 bg-rush-light-gray">
                      <Image
                        src={pub.image}
                        alt={`Key figure from ${pub.title}`}
                        width={288}
                        height={200}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Paper details */}
                  <div className="flex-1 p-6">
                    {/* Journal badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center rounded-full bg-rush-green px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                        {pub.journal}
                      </span>
                      <span className="text-sm text-rush-umber">{pub.year}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-rush-charcoal mb-3 group-hover:text-rush-green transition-colors leading-snug">
                      {pub.title}
                    </h3>

                    {/* Authors */}
                    <p className="text-sm text-rush-umber mb-4 leading-relaxed">
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
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
