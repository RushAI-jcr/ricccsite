import type { Metadata } from "next";

export const revalidate = 3600; // ISR: revalidate at most every hour (on-demand via admin panel)
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { RESEARCH_PILLARS } from "@/lib/research-pillars";
import { getAllTeamMembers, type TeamMember } from "@/lib/team";

export const metadata: Metadata = {
  title: "Mission | Advancing Critical Care Through Data Science & AI",
  description:
    "RICCC's mission at Rush University. ICU data science, AI, federated research through the CLIF consortium, pragmatic clinical trials, and interdisciplinary collaboration in Chicago critical care.",
};

/** First paragraph of MDX bio, with simple bold markers stripped — for /mission when mission_blurb is unset */
function missionBlurbFromBio(bio: string): string {
  const block = bio.trim().split(/\n\s*\n/)[0] ?? "";
  return block.replace(/\*\*([^*]+)\*\*/g, "$1").trim();
}

function missionSubtitle(pi: TeamMember): string {
  return pi.missionSubtitle?.trim() || pi.role;
}

export default function MissionPage() {
  const pis = getAllTeamMembers().filter((m) => m.tier === "pi");

  return (
    <main className="bg-rush-surface text-rush-on-surface">
      {/* Hero */}
      <section className="pt-32 pb-16 max-w-screen-2xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <span className="font-mono text-xs uppercase tracking-widest text-rush-teal mb-6 block">
              Established {siteConfig.metrics.founded} &bull; Rush University
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-rush-dark-green tracking-tight leading-[1.1] mb-8">
              Advancing Critical Care Through Data Science
            </h1>
            <p className="text-xl text-rush-on-surface-variant max-w-2xl leading-relaxed mb-10">
              Every ICU stay produces thousands of data points: vitals, labs, ventilator
              settings, and medication drips. But most of that information never makes it back to the
              bedside. We think it should. RICCC is a small, interdisciplinary group at Rush
              working to connect ICU data to better decisions: through federated research with
              the <a href="https://clif-icu.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-rush-dark-green underline underline-offset-4">CLIF Consortium</a>, pragmatic trials embedded in everyday workflows, and causal
              inference methods that help clinicians personalize care for critically ill patients.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#mission"
                className="bg-rush-dark-green text-white px-8 py-4 rounded-sm font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Explore Our Mission
              </a>
              <Link
                href="/publications"
                className="border border-rush-outline-variant text-rush-dark-green px-8 py-4 rounded-sm font-semibold text-sm hover:bg-rush-surface-container transition-colors"
              >
                View Publications
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics strip */}
      <section className="bg-rush-surface-container py-24">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            <div className="border-l border-rush-dark-green/10 pl-6">
              <div className="font-mono text-xs uppercase tracking-widest text-rush-teal mb-2">
                ICU Encounters
              </div>
              <div className="text-4xl font-bold text-rush-dark-green mb-1">808,000+</div>
              <div className="text-sm text-rush-on-surface-variant font-medium">
                ICU patients across CLIF network
              </div>
            </div>
            <div className="border-l border-rush-dark-green/10 pl-6">
              <div className="font-mono text-xs uppercase tracking-widest text-rush-teal mb-2">
                CLIF Network
              </div>
              <div className="text-4xl font-bold text-rush-dark-green mb-1">17</div>
              <div className="text-sm text-rush-on-surface-variant font-medium">
                Institutions, 62 hospitals
              </div>
            </div>
            <div className="border-l border-rush-dark-green/10 pl-6">
              <div className="font-mono text-xs uppercase tracking-widest text-rush-teal mb-2">
                Publications
              </div>
              <div className="text-4xl font-bold text-rush-dark-green mb-1">
                {siteConfig.metrics.publications}+
              </div>
              <div className="text-sm text-rush-on-surface-variant font-medium">
                Peer-reviewed works
              </div>
            </div>
            <div className="border-l border-rush-dark-green/10 pl-6">
              <div className="font-mono text-xs uppercase tracking-widest text-rush-teal mb-2">
                Active Projects
              </div>
              <div className="text-4xl font-bold text-rush-dark-green mb-1">
                {siteConfig.metrics.activeProjects}
              </div>
              <div className="text-sm text-rush-on-surface-variant font-medium">
                Ongoing studies
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission editorial */}
      <section id="mission" className="py-32 max-w-screen-2xl mx-auto px-6 lg:px-8 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sticky aside */}
          <aside className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
            <h2 className="text-3xl font-bold text-rush-dark-green leading-tight mb-6">
              The Lab
              <br />
              Mission
            </h2>
            <div className="h-1 w-12 bg-rush-secondary-container mb-8" />
            <p className="text-rush-on-surface-variant leading-relaxed">
              ICU care is rich in data but poor in synthesis. Our mission is to build the methods,
              tools, and evidence to change that. At Rush, we work with investigators in emergency
              medicine and respiratory therapy on shared trials and data science, because the
              problems that matter at the bedside cannot be solved by any single discipline alone.
            </p>
          </aside>

          {/* Numbered goals */}
          <div className="lg:col-span-8 space-y-24">
            {RESEARCH_PILLARS.map((pillar, index) => (
              <div key={pillar.id} className="ml-0 lg:ml-10 group">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-mono text-rush-teal text-lg">
                    {String(index + 1).padStart(2, "0")}.
                  </span>
                  <h3 className="text-2xl font-bold text-rush-dark-green">{pillar.title}</h3>
                </div>
                <p className="text-lg text-rush-on-surface-variant leading-relaxed">
                  {pillar.full}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lab leadership */}
      <section className="bg-rush-surface-container py-32">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-rush-dark-green mb-4">Lab Leadership</h2>
            <p className="text-rush-on-surface-variant">
              Department of Internal Medicine, Division of Pulmonary, Critical Care and Sleep
              Medicine, Rush University.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {pis.map((pi) => (
              <div
                key={pi.slug}
                className="flex gap-6 items-start p-6 rounded-sm border border-rush-outline-variant/20 bg-rush-surface-container-low transition-all hover:border-rush-outline-variant/40"
              >
                <div className="w-16 h-16 flex-shrink-0 rounded-full bg-rush-surface-container-high border border-rush-outline-variant/30 overflow-hidden">
                  {pi.photo && (
                    <Image
                      src={pi.photo}
                      alt={pi.name}
                      width={64}
                      height={64}
                      sizes="64px"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-lg font-bold text-rush-dark-green mb-0.5">{pi.name}</h4>
                  <p className="font-mono text-xs text-rush-teal tracking-widest mb-3">
                    {missionSubtitle(pi)}
                  </p>
                  <p className="text-sm text-rush-on-surface-variant leading-relaxed">
                    {pi.missionBlurb?.trim() || missionBlurbFromBio(pi.bio)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-rush-dark-green mb-8 tracking-tight">
            Interested in Working Together?
          </h2>
          <p className="text-xl text-rush-on-surface-variant mb-12 leading-relaxed max-w-2xl">
            If you work in critical care research, data science, or clinical informatics and want
            to collaborate, we would like to hear from you.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact#inquiry"
              className="bg-rush-dark-green text-white px-10 py-5 rounded-sm font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Inquire About Collaboration
            </Link>
            <Link
              href="/publications"
              className="text-rush-dark-green font-bold px-10 py-5 underline underline-offset-8 decoration-rush-teal hover:text-rush-teal transition-colors"
            >
              Read Our Latest Work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
