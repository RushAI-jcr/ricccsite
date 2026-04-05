import Image from "next/image";
import { type TeamMember } from "@/lib/team";
import {
  hasMemberSocialLinks,
  MemberSocialLinks,
} from "@/components/team/member-social-links";

// Usage:
// <PiBio member={pi} index={0} />   → left-text / right-photo (surface-container-low bg)
// <PiBio member={pi} index={1} />   → right-text / left-photo (surface-container-high bg)

interface PiBioProps {
  member: TeamMember;
  /** Controls alternating layout (even = text left, odd = text right) */
  index?: number;
}

/** Extract interest tags from the first sentence of the bio.
 *  "Research interests include clinical data science, critical care informatics, and healthcare equity."
 *  → ["Clinical Data Science", "Critical Care Informatics", "Healthcare Equity"]
 */
function extractInterests(bio: string): string[] {
  const firstLine = bio.split("\n")[0].trim();
  const match = firstLine.match(/research interests include (.+?)\.?$/i);
  if (!match) return [];
  return match[1]
    .split(/,\s*(?:and\s*)?/)
    .map((tag) => tag.replace(/\.$/, "").trim())
    .filter(Boolean);
}

/** All bio paragraphs before **Education** or similar headers. */
function getLeadParagraphs(bio: string): string[] {
  const blocks = bio.split("\n\n");
  const lead: string[] = [];
  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed || /^\*\*/.test(trimmed) || /^-\s/.test(trimmed)) break;
    if (/^research interests include/i.test(trimmed)) continue;
    lead.push(trimmed);
  }
  return lead;
}

export function PiBio({ member, index = 0 }: PiBioProps) {
  const isReversed = index % 2 !== 0;
  const interests = extractInterests(member.bio);
  const leadParagraphs = getLeadParagraphs(member.bio);

  const contentBg = isReversed
    ? "bg-rush-surface-container-high"
    : "bg-rush-surface-container-low";

  const primaryRole = member.role.split(" | ")[0];

  return (
    <section id={member.slug} className="mb-0" aria-label={`${member.name} profile`}>
      <div className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} items-stretch gap-0`}>
        {/* Text panel */}
        <div className={`lg:w-2/3 ${contentBg} p-10 md:p-16 flex flex-col justify-center`}>
          <div className={`max-w-xl ${isReversed ? "mr-auto" : "ml-auto"}`}>
            <span className="font-mono text-xs uppercase tracking-widest text-rush-teal mb-4 block">
              Principal Investigator
            </span>

            <h2 className="text-3xl font-bold text-rush-dark-green mb-2 leading-tight">
              {member.name}
            </h2>

            <p className="font-mono text-sm text-rush-on-surface-variant mb-8 leading-relaxed">
              {primaryRole}
            </p>

            {leadParagraphs.length > 0 && (
              <div className="space-y-4 text-rush-on-surface/80 leading-relaxed mb-8">
                {leadParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}

            {interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {interests.map((tag) => (
                  <span
                    key={tag}
                    className="bg-rush-secondary-container text-rush-dark-green text-[10px] font-mono px-3 py-1 rounded-sm uppercase tracking-widest"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {hasMemberSocialLinks(member) && (
              <div className="space-y-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-rush-on-surface-variant/70 block">
                  Profiles & links
                </span>
                <MemberSocialLinks member={member} variant="pi" />
              </div>
            )}
          </div>
        </div>

        {/* Photo panel */}
        <div className="lg:w-1/3 h-[280px] lg:h-auto overflow-hidden relative bg-rush-surface-container">
          {member.photo ? (
            <Image
              src={member.photo}
              alt={`Portrait of ${member.name}`}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-rush-surface-container-high min-h-[280px]">
              <span className="font-mono text-6xl font-bold text-rush-on-surface-variant/20 select-none">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
