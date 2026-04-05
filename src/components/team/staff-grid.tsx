import Image from "next/image";
import { type TeamMember } from "@/lib/team";
import { MemberSocialLinks } from "@/components/team/member-social-links";
import { Mail } from "lucide-react";

type StaffGroupKey = "analytics" | "regulatory" | "assistants";

const GROUP_ORDER: StaffGroupKey[] = ["analytics", "regulatory", "assistants"];

const GROUP_STYLE: Record<StaffGroupKey, string> = {
  analytics:
    "bg-rush-surface-container-high shadow-card",
  regulatory:
    "bg-rush-surface-container shadow-card-sm",
  assistants:
    "bg-rush-dark-green text-white",
};

function groupKeyForRole(role: string): StaffGroupKey {
  if (role === "Regulatory Coordinator") return "regulatory";
  if (role === "Research Assistant") return "assistants";
  return "analytics";
}

function groupMembers(members: TeamMember[]): Record<StaffGroupKey, TeamMember[]> {
  const out: Record<StaffGroupKey, TeamMember[]> = {
    analytics: [],
    regulatory: [],
    assistants: [],
  };
  for (const m of members) {
    out[groupKeyForRole(m.role)].push(m);
  }
  for (const k of GROUP_ORDER) {
    out[k].sort((a, b) => a.displayOrder - b.displayOrder);
  }
  return out;
}

function MemberRow({
  member,
  variant,
}: {
  member: TeamMember;
  variant: "light" | "dark";
}) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const nameClass =
    variant === "dark"
      ? "text-white group-hover:text-rush-secondary-container transition-colors"
      : "text-rush-on-surface group-hover:text-rush-dark-green transition-colors";

  const roleClass =
    variant === "dark"
      ? "text-white/65 font-mono text-xs uppercase tracking-widest mt-1"
      : "text-rush-on-surface-variant/80 font-mono text-xs uppercase tracking-widest mt-1";

  const borderClass =
    variant === "dark" ? "border-white/10" : "border-rush-outline-variant/20";

  const bioPreview =
    member.bio && member.bio.trim().length > 0
      ? member.bio.split("\n\n")[0].trim()
      : null;

  return (
    <div
      className={`group flex flex-col sm:flex-row gap-4 sm:gap-5 pb-5 border-b ${borderClass} last:border-0 last:pb-0`}
    >
      <div
        className={`shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-sm overflow-hidden ${
          variant === "dark" ? "bg-white/10 ring-1 ring-white/10" : "bg-rush-surface-container"
        }`}
      >
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            width={96}
            height={96}
            sizes="96px"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className={`font-mono text-sm font-bold select-none ${
                variant === "dark" ? "text-white/40" : "text-rush-on-surface-variant/45"
              }`}
            >
              {initials}
            </span>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className={`font-bold text-xl leading-snug ${nameClass}`}>{member.name}</h3>
        <p className={roleClass}>{member.role}</p>

        {bioPreview && (
          <p
            className={`text-sm mt-2 leading-relaxed line-clamp-4 ${
              variant === "dark" ? "text-white/75" : "text-rush-on-surface-variant"
            }`}
          >
            {bioPreview}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest border-b pb-0.5 transition-colors ${
                variant === "dark"
                  ? "text-rush-secondary-container border-rush-secondary-container/40 hover:border-rush-secondary-container"
                  : "text-rush-dark-green border-rush-dark-green/30 hover:border-rush-dark-green"
              }`}
            >
              <Mail className="h-3 w-3" aria-hidden />
              Email
            </a>
          )}
          <MemberSocialLinks
            member={member}
            variant={variant === "dark" ? "staff-dark" : "staff-light"}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}

export function StaffGrid({
  members,
  title,
}: {
  members: TeamMember[];
  title?: string;
}) {
  if (members.length === 0) return null;

  const grouped = groupMembers(members);
  const hasRegulatory = grouped.regulatory.length > 0;
  const hasAnalytics = grouped.analytics.length > 0;

  const labels: Record<StaffGroupKey, string> = {
    analytics: "01. Analytics & data science",
    regulatory: "02. Regulatory",
    assistants: "03. Research assistants",
  };

  return (
    <div>
      {title && (
        <h2 className="text-2xl font-bold text-rush-dark-green mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {GROUP_ORDER.map((key) => {
          const list = grouped[key];
          if (list.length === 0) return null;
          const isDark = key === "assistants";

          return (
            <div
              key={key}
              className={`rounded-sm p-10 md:p-12 ${
                key === "assistants"
                  ? "lg:col-span-12"
                  : hasAnalytics && hasRegulatory
                    ? key === "analytics" ? "lg:col-span-7" : "lg:col-span-5"
                    : "lg:col-span-12"
              } ${GROUP_STYLE[key]}`}
            >
              <span
                className={`font-mono text-[10px] uppercase tracking-widest block mb-8 ${
                  isDark ? "text-white/55" : "text-rush-dark-green"
                }`}
              >
                {labels[key]}
              </span>
              <div>
                {list.map((member) => (
                  <MemberRow
                    key={member.slug}
                    member={member}
                    variant={isDark ? "dark" : "light"}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
