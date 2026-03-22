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
    <section className="py-16 lg:py-24 bg-rush-light-gray">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-rush-indigo mb-2">
          Research Spotlights
        </h2>
        <p className="text-rush-mid-gray mb-10">
          Recent publications from our lab
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-rush-deep-blue mb-2">
                      {pub.journal} &middot; {pub.year}
                    </p>
                    <h3 className="text-lg font-semibold text-rush-charcoal mb-2 group-hover:text-rush-deep-blue transition-colors leading-snug">
                      {pub.title}
                    </h3>
                    <p className="text-sm text-rush-mid-gray">{pub.authors}</p>
                  </div>
                  {href && (
                    <ExternalLink className="h-5 w-5 text-rush-mid-gray group-hover:text-rush-deep-blue transition-colors shrink-0 mt-1" />
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
