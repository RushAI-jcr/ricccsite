import Image from "next/image";
import { type TeamMember } from "@/lib/team";
import { ExternalLink } from "lucide-react";
import { isSafeUrl } from "@/lib/url";

function MemberCard({ member }: { member: TeamMember }) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            width={80}
            height={80}
            className="rounded-lg object-cover shrink-0"
          />
        ) : (
          <div className="w-[80px] h-[80px] rounded-lg bg-rush-teal flex items-center justify-center text-white text-lg font-bold shrink-0">
            {initials}
          </div>
        )}

        <div className="min-w-0">
          <h3 className="font-semibold text-rush-charcoal">{member.name}</h3>
          <p className="text-sm text-rush-teal">{member.role}</p>
          {member.bio && (
            <p className="text-sm text-rush-mid-gray mt-1 line-clamp-2">
              {member.bio}
            </p>
          )}
          <div className="flex gap-3 mt-2">
            {member.scholar && isSafeUrl(member.scholar) && (
              <a
                href={member.scholar}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rush-mid-gray hover:text-rush-teal"
                aria-label={`${member.name} Google Scholar`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            {member.github && (
              <a
                href={`https://github.com/${member.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rush-mid-gray hover:text-rush-teal"
                aria-label={`${member.name} GitHub`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
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

  return (
    <div>
      {title && <h2 className="text-2xl font-bold text-rush-green mb-6">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <MemberCard key={member.slug} member={member} />
        ))}
      </div>
    </div>
  );
}
