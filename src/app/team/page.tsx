import type { Metadata } from "next";
import { getTeamMembersByTier } from "@/lib/team";
import { PiBio } from "@/components/team/pi-bio";
import { StaffGrid } from "@/components/team/staff-grid";
import { StudentList } from "@/components/team/student-list";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the RICCC Lab team",
};

export default function TeamPage() {
  const grouped = getTeamMembersByTier();

  const hasMembers =
    grouped.pi.length > 0 ||
    grouped.staff.length > 0 ||
    grouped.student.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-rush-indigo mb-4">Our Team</h1>
      <p className="text-rush-mid-gray text-lg mb-12 max-w-2xl">
        A multidisciplinary team of clinicians, data scientists, and trainees
        working to advance critical care through computation.
      </p>

      {!hasMembers && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <p className="text-rush-mid-gray">
            Team profiles are being set up. Check back soon.
          </p>
        </div>
      )}

      {grouped.pi.map((pi) => (
        <PiBio key={pi.slug} member={pi} />
      ))}

      <StaffGrid members={grouped.staff} title="Research Staff" />

      <StudentList members={grouped.student} />

      {grouped.alumni.length > 0 && (
        <details className="mb-12">
          <summary className="text-lg font-semibold text-rush-indigo cursor-pointer mb-4 hover:text-rush-deep-blue">
            Alumni ({grouped.alumni.length})
          </summary>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {grouped.alumni.map((member) => (
              <div
                key={member.slug}
                className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm opacity-75"
              >
                <div className="w-10 h-10 rounded-full bg-rush-mid-gray flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-rush-charcoal truncate">
                    {member.name}
                  </p>
                  <p className="text-xs text-rush-mid-gray truncate">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
