import { type TeamMember } from "@/lib/team";
import { MemberSocialLinks } from "@/components/team/member-social-links";

// Compact roster for trainees / collaborators — Stitch-aligned: soft surfaces, no harsh grid lines.

export function CompactMemberGrid({
  members,
  className,
}: {
  members: TeamMember[];
  className?: string;
}) {
  if (members.length === 0) return null;

  return (
    <div
      className={`flex flex-col gap-3 ${className ?? ""}`}
    >
      {members.map((member, i) => {
        const initials = member.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2);

        const surface =
          i % 2 === 0
            ? "bg-rush-surface-container-low"
            : "bg-rush-surface";

        return (
          <div
            key={member.slug}
            className={`group flex items-center gap-4 rounded-sm px-5 py-4 ${surface} shadow-card-sm transition-colors hover:bg-rush-surface-container`}
          >
            <div className="w-11 h-11 shrink-0 rounded-sm bg-rush-surface-container-high flex items-center justify-center ring-1 ring-rush-outline-variant/15">
              <span className="font-mono text-xs font-bold text-rush-on-surface-variant/55 select-none uppercase">
                {initials}
              </span>
            </div>

            <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-sm text-rush-on-surface group-hover:text-rush-dark-green transition-colors leading-snug">
                  {member.name}
                </p>
                <p className="font-mono text-[10px] text-rush-teal uppercase tracking-widest mt-1">
                  {member.role}
                </p>
              </div>
              <MemberSocialLinks member={member} variant="compact" className="sm:justify-end" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
