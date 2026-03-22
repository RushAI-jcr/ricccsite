import { type TeamMember } from "@/lib/team";

export function StudentList({ members }: { members: TeamMember[] }) {
  if (members.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-rush-indigo mb-6">Students</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {members.map((member) => {
          const initials = member.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2);

          return (
            <div
              key={member.slug}
              className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-rush-cerulean flex items-center justify-center text-white text-sm font-semibold shrink-0">
                {initials}
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
          );
        })}
      </div>
    </section>
  );
}
