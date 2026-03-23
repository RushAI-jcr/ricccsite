import { Activity, Brain, ShieldCheck, type LucideIcon } from "lucide-react";
import Link from "next/link";

interface Domain {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const domains: Domain[] = [
  {
    title: "Clinical Data Science",
    description:
      "Leveraging large-scale clinical data to improve patient outcomes through predictive modeling and clinical decision support.",
    icon: Activity,
    color: "bg-rush-teal",
  },
  {
    title: "AI in Critical Care",
    description:
      "Developing and validating artificial intelligence tools for real-time monitoring and early warning systems in the ICU.",
    icon: Brain,
    color: "bg-rush-green",
  },
  {
    title: "Healthcare Equity & Allocation",
    description:
      "Ensuring fair and evidence-based resource allocation across diverse patient populations using computational methods.",
    icon: ShieldCheck,
    color: "bg-rush-emerald",
  },
];

function DomainCard({ domain, className }: { domain: Domain; className?: string }) {
  const Icon = domain.icon;
  return (
    <Link
      href="/research"
      className={`group relative bg-white rounded-xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 border border-transparent hover:border-rush-teal/30 transition-[transform,box-shadow,border-color] duration-300 ${className ?? ""}`}
    >
      <div
        className={`w-12 h-12 rounded-lg ${domain.color} flex items-center justify-center mb-4`}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-rush-charcoal mb-2 group-hover:text-rush-teal transition-colors">
        {domain.title}
      </h3>
      <p className="text-rush-mid-gray leading-relaxed">
        {domain.description}
      </p>
    </Link>
  );
}

export function ResearchDomains() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-rush-green mb-4">
          Research Focus Areas
        </h2>
        <p className="text-rush-mid-gray text-lg mb-12 max-w-2xl">
          Our lab sits at the intersection of data science, medicine, and ethics
          — tackling problems that matter for patient care.
        </p>

        {/* Asymmetric layout — NOT a symmetric 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <DomainCard domain={domains[0]} className="md:col-span-7" />
          <DomainCard domain={domains[1]} className="md:col-span-5" />

          {/* Third card full-width with horizontal layout on desktop */}
          <Link
            href="/research"
            className="md:col-span-12 group relative bg-white rounded-xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 border border-transparent hover:border-rush-emerald/30 transition-[transform,box-shadow,border-color] duration-300"
          >
            <div className="md:flex md:items-start md:gap-6">
              <div
                className={`w-12 h-12 rounded-lg ${domains[2].color} flex items-center justify-center mb-4 md:mb-0 shrink-0`}
              >
                {(() => {
                  const Icon = domains[2].icon;
                  return <Icon className="h-6 w-6 text-white" />;
                })()}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-rush-charcoal mb-2 group-hover:text-rush-teal transition-colors">
                  {domains[2].title}
                </h3>
                <p className="text-rush-mid-gray leading-relaxed">
                  {domains[2].description}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
