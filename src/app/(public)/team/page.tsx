import type { Metadata } from "next";

export const revalidate = 3600; // ISR: revalidate at most every hour (on-demand via admin panel)
import Link from "next/link";
import { getTeamMembersByTier } from "@/lib/team";
import { PiBio } from "@/components/team/pi-bio";
import { StaffGrid } from "@/components/team/staff-grid";
import { CompactMemberGrid } from "@/components/team/compact-member-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Team — ICU Researchers, Data Scientists & AI",
  description:
    "Meet Juan C. Rojas (J.C. Rojas), Kevin Buell, and the RICCC Lab team — clinicians, data scientists, and trainees advancing ICU data science, AI, and clinical trials at Rush University in Chicago.",
};

export default function TeamPage() {
  const grouped = getTeamMembersByTier();

  const hasMembers =
    grouped.pi.length > 0 ||
    grouped.staff.length > 0 ||
    grouped.student.length > 0 ||
    grouped.alumni.length > 0 ||
    grouped.collaborator.length > 0;

  const hasGrid =
    grouped.staff.length > 0 ||
    grouped.student.length > 0 ||
    grouped.alumni.length > 0 ||
    grouped.collaborator.length > 0;

  const piSchemas = grouped.pi.map((pi) => {
    const sameAs: string[] = [];
    if (pi.scholar) sameAs.push(pi.scholar);
    if (pi.orcid) sameAs.push(`https://orcid.org/${pi.orcid}`);
    if (pi.linkedin) sameAs.push(pi.linkedin);

    return {
      "@context": "https://schema.org",
      "@type": "Person",
      name: pi.name.replace(/,.*$/, ""),
      ...(pi.alternateNames && { alternateName: pi.alternateNames }),
      jobTitle: pi.role.split(" | ")[0],
      worksFor: {
        "@type": "ResearchOrganization",
        name: "RICCC",
        parentOrganization: {
          "@type": "CollegeOrUniversity",
          name: "Rush University System for Health",
        },
      },
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: "Rush University System for Health",
      },
      url: `${siteConfig.url}/team#${pi.slug}`,
      ...(pi.photo && { image: `${siteConfig.url}${pi.photo}` }),
      ...(sameAs.length > 0 && { sameAs }),
    };
  });

  return (
    <main className="bg-rush-surface min-h-screen">
      {grouped.pi.map((pi, i) => (
        <JsonLd key={pi.slug} data={piSchemas[i]} />
      ))}
      {/* ── Hero header ─────────────────────────────────────────────── */}
      <header className="pt-32 pb-20 max-w-screen-2xl mx-auto px-8">
        <div className="ml-0 lg:ml-12">
          <span className="font-mono text-xs uppercase tracking-widest text-rush-teal mb-4 block">
            Our Investigators
          </span>
          <h1
            className="text-5xl md:text-7xl font-bold tracking-tight text-rush-dark-green leading-[1.1] max-w-4xl"
            aria-label="The Investigative Multidisciplinary Team"
          >
            The Investigative
            <br />
            <span className="text-rush-on-surface-variant/40">Multidisciplinary</span>{" "}
            Team.
          </h1>
          <p className="mt-8 text-lg md:text-xl text-rush-on-surface-variant max-w-2xl leading-relaxed">
            Clinicians, data scientists, and trainees at Rush working together
            on ICU research — from predictive models to pragmatic trials.
          </p>
        </div>
      </header>

      {/* ── Empty state ──────────────────────────────────────────────── */}
      {!hasMembers && (
        <div className="max-w-7xl mx-auto px-8 pb-24">
          <p className="font-mono text-sm text-rush-on-surface-variant/60 uppercase tracking-widest">
            Team profiles are being set up. Check back soon.
          </p>
        </div>
      )}

      {/* ── PI Spotlights ────────────────────────────────────────────── */}
      {grouped.pi.length > 0 && (
        <section aria-label="Principal Investigators">
          {grouped.pi.map((pi, i) => (
            <PiBio key={pi.slug} member={pi} index={i} />
          ))}
        </section>
      )}

      {/* ── Staff / Students / Alumni / Collaborators grid ───────────── */}
      {hasGrid && (
        <section
          className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-24 bg-rush-mint/25 border-t border-rush-outline-variant/15"
          aria-label="Multidisciplinary cohort"
        >
          {/* Section header — Stitch: asymmetric gutter + bar */}
          <div className="ml-0 lg:ml-12 mb-14 max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-widest text-rush-teal mb-3 block">
              The full cohort
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-rush-dark-green leading-tight">
              Multidisciplinary cohort
            </h2>
            <div className="h-1 w-24 bg-rush-teal mt-5" aria-hidden />
            <p className="mt-6 text-base text-rush-on-surface-variant leading-relaxed max-w-2xl">
              Biostatistics, data science, regulatory coordination, and research operations — the
              engine behind RICCC&apos;s studies and federated data work.
            </p>
          </div>

          <div className="space-y-16">
            {grouped.staff.length > 0 && (
              <div>
                <StaffGrid members={grouped.staff} />
              </div>
            )}

            {grouped.student.length > 0 && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-rush-dark-green mb-6">
                  02. Trainees
                </p>
                <CompactMemberGrid members={grouped.student} />
              </div>
            )}

            {grouped.collaborator.length > 0 && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-rush-dark-green mb-6">
                  03. Collaborators
                </p>
                <CompactMemberGrid members={grouped.collaborator} />
              </div>
            )}

            {grouped.alumni.length > 0 && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-rush-on-surface-variant/50 mb-6">
                  Alumni
                </p>
                <CompactMemberGrid
                  members={grouped.alumni}
                  className="opacity-60"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Recruitment CTA ──────────────────────────────────────────── */}
      <section
        className="max-w-screen-2xl mx-auto px-8 pb-24"
        aria-label="Join the team"
      >
        <div className="bg-rush-surface-container-low border border-rush-outline-variant/30 p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center gap-8 group hover:bg-rush-surface-container transition-colors duration-300">
          {/* Icon badge */}
          <div className="shrink-0 w-16 h-16 bg-rush-secondary-container flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7 text-rush-dark-green"
              aria-hidden="true"
            >
              <path d="M6.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM3.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM19.75 7.5a.75.75 0 0 1 .75.75v2.25h2.25a.75.75 0 0 1 0 1.5H20.5v2.25a.75.75 0 0 1-1.5 0V12h-2.25a.75.75 0 0 1 0-1.5H19v-2.25a.75.75 0 0 1 .75-.75Z" />
            </svg>
          </div>

          <div>
            <h3 className="text-xl font-bold text-rush-dark-green mb-1">
              Interested in joining the lab?
            </h3>
            <p className="text-rush-on-surface-variant text-sm mb-4 max-w-lg">
              We are always happy to hear from clinicians, data scientists, and
              trainees who want to work on ICU research problems.
            </p>
            <Link
              href="/contact"
              className="font-mono text-xs uppercase tracking-widest text-rush-dark-green border-b border-rush-dark-green/30 pb-0.5 hover:border-rush-dark-green transition-colors"
            >
              View Opportunities
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
