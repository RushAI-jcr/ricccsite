import Image from "next/image";
import { type TeamMember } from "@/lib/team";
import { ExternalLink } from "lucide-react";
import { isSafeUrl } from "@/lib/url";

function AcademicLink({ href, label }: { href: string; label: string }) {
  if (!isSafeUrl(href)) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm text-rush-teal hover:underline"
    >
      {label}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

export function PiBio({ member }: { member: TeamMember }) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <section className="mb-16">
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="shrink-0">
            {member.photo ? (
              <Image
                src={member.photo}
                alt={member.name}
                width={200}
                height={200}
                sizes="200px"
                className="rounded-xl object-cover"
              />
            ) : (
              <div className="w-[200px] h-[200px] rounded-xl bg-rush-green flex items-center justify-center text-white text-4xl font-bold">
                {initials}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-rush-charcoal mb-1">
              {member.name}
            </h2>
            <div className="text-rush-teal font-medium mb-1 space-y-0.5">
              {member.role.split(" | ").map((title) => (
                <p key={title}>{title}</p>
              ))}
            </div>
            <p className="text-rush-mid-gray text-sm mb-4">{member.email}</p>

            {member.bio && (
              <div className="text-rush-charcoal leading-relaxed mb-4 space-y-2">
                {/* Supports: **heading**, bullet lists (- item), plain paragraphs */}
                {member.bio.split("\n\n").map((block, i) => {
                  const trimmed = block.trim();
                  // Bold headings: **text**
                  if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
                    return (
                      <h3 key={i} className="font-semibold text-rush-green mt-4 mb-1">
                        {trimmed.replace(/\*\*/g, "")}
                      </h3>
                    );
                  }
                  // Bullet list
                  if (trimmed.startsWith("- ") || trimmed.includes("\n- ")) {
                    const items = trimmed
                      .split("\n")
                      .filter((line) => line.startsWith("- "))
                      .map((line) => line.slice(2));
                    return (
                      <ul key={i} className="list-disc list-inside text-sm space-y-1">
                        {items.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    );
                  }
                  // Regular paragraph
                  return <p key={i}>{trimmed}</p>;
                })}
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              {member.orcid && (
                <AcademicLink
                  href={`https://orcid.org/${member.orcid}`}
                  label="ORCID"
                />
              )}
              {member.scholar && (
                <AcademicLink href={member.scholar} label="Google Scholar" />
              )}
              {member.website && (
                <AcademicLink href={member.website} label="Website" />
              )}
              {member.github && (
                <AcademicLink
                  href={`https://github.com/${member.github}`}
                  label="GitHub"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
