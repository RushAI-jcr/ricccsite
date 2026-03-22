import { ExternalLink } from "lucide-react";
import { type Publication } from "@/lib/pubmed";

export function PubCard({ pub }: { pub: Publication }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-rush-charcoal leading-snug mb-2">
            {pub.title}
          </h3>
          <p className="text-sm text-rush-mid-gray mb-1">{pub.authors}</p>
          {pub.journal && (
            <p className="text-sm text-rush-deep-blue font-medium">
              {pub.journal} {pub.year && `(${pub.year})`}
            </p>
          )}
        </div>
        {pub.citationCount != null && pub.citationCount > 0 && (
          <div className="shrink-0 text-center">
            <div className="text-lg font-bold text-rush-indigo">
              {pub.citationCount}
            </div>
            <div className="text-[10px] text-rush-mid-gray uppercase tracking-wider">
              cited
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {pub.pmid && (
          <a
            href={`https://pubmed.ncbi.nlm.nih.gov/${pub.pmid}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-rush-light-gray px-3 py-1 text-xs font-medium text-rush-charcoal hover:bg-gray-200 transition-colors"
          >
            PubMed <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {pub.doi && (
          <a
            href={`https://doi.org/${pub.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-rush-light-gray px-3 py-1 text-xs font-medium text-rush-charcoal hover:bg-gray-200 transition-colors"
          >
            DOI <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
