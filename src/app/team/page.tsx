import type { Metadata } from "next";
import { getTeamMembersByTier } from "@/lib/team";
import { PiBio } from "@/components/team/pi-bio";
import { StaffGrid } from "@/components/team/staff-grid";
import { CompactMemberGrid } from "@/components/team/compact-member-grid";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the RICCC Lab team",
};

export default function TeamPage() {
  const grouped = getTeamMembersByTier();

  const hasMembers =
    grouped.pi.length > 0 ||
    grouped.staff.length > 0 ||
    grouped.student.length > 0 ||
    grouped.alumni.length > 0 ||
    grouped.collaborator.length > 0;

  return (
    <div>
      <PageHeader
        title="Our Team"
        description="A multidisciplinary team of clinicians, data scientists, and trainees working to advance critical care through computation."
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {!hasMembers && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <p className="text-rush-mid-gray">
              Team profiles are being set up. Check back soon.
            </p>
          </div>
        )}

        {grouped.pi.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-rush-green mb-6">Principal Investigators</h2>
            {grouped.pi.map((pi) => (
              <PiBio key={pi.slug} member={pi} />
            ))}
          </section>
        )}

        {grouped.staff.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-rush-green mb-6">Research Team</h2>
            <StaffGrid members={grouped.staff} />
          </section>
        )}

        {grouped.student.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-rush-green mb-6">Trainees</h2>
            <CompactMemberGrid members={grouped.student} color="bg-rush-emerald" />
          </section>
        )}

        {grouped.alumni.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-rush-green mb-6">Alumni</h2>
            <CompactMemberGrid members={grouped.alumni} color="bg-rush-mid-gray" className="opacity-75" />
          </section>
        )}

        {grouped.collaborator.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-rush-green mb-6">Collaborators</h2>
            <CompactMemberGrid members={grouped.collaborator} color="bg-rush-teal" />
          </section>
        )}
      </div>
    </div>
  );
}
