import type { ReactNode } from "react";
import { type TeamMember } from "@/lib/team";
import { Github, Globe } from "lucide-react";
import { GoogleScholarIcon, LinkedInIcon } from "@/components/icons/brand-social";
import { isLinkedInUrl, isSafeUrl } from "@/lib/url";
import { cn } from "@/lib/utils";

type SocialVariant = "pi" | "staff-light" | "staff-dark" | "compact";

interface SocialItem {
  key: string;
  href: string;
  label: string;
}

/** Validated social link items for a team member (shared by predicate + renderer). */
function getSocialItems(member: TeamMember): SocialItem[] {
  const items: SocialItem[] = [];

  if (member.linkedin && isSafeUrl(member.linkedin) && isLinkedInUrl(member.linkedin)) {
    items.push({ key: "linkedin", href: member.linkedin, label: `${member.name} on LinkedIn` });
  }
  if (member.scholar && isSafeUrl(member.scholar)) {
    items.push({ key: "scholar", href: member.scholar, label: `${member.name} on Google Scholar` });
  }
  if (member.orcid && /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(member.orcid)) {
    items.push({ key: "orcid", href: `https://orcid.org/${member.orcid}`, label: `${member.name} ORCID` });
  }
  if (member.website && isSafeUrl(member.website)) {
    items.push({ key: "website", href: member.website, label: `${member.name} website` });
  }
  if (member.github && /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(member.github)) {
    items.push({ key: "github", href: `https://github.com/${member.github}`, label: `${member.name} on GitHub` });
  }

  return items;
}

/** True if any external profile link is set and valid (used to hide empty sections). */
export function hasMemberSocialLinks(member: TeamMember): boolean {
  return getSocialItems(member).length > 0;
}

function OrcidIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.369c.736 0 1.192.48 1.192 1.128 0 .648-.456 1.128-1.192 1.128-.72 0-1.176-.48-1.176-1.128 0-.648.456-1.128 1.176-1.128zm.936 3.6H6.432V19.2h1.873V7.969zm5.447 0c2.52 0 4.176 1.68 4.176 4.32 0 2.664-1.656 4.344-4.176 4.344-1.08 0-2.064-.408-2.664-1.128V19.2H9.969V7.969h1.873v1.128c.6-.72 1.584-1.128 2.664-1.128zm-.072 6.48c1.464 0 2.424-.936 2.424-2.4 0-1.464-.96-2.4-2.424-2.4-1.464 0-2.424.936-2.424 2.4 0 1.464.96 2.4 2.424 2.4z" />
    </svg>
  );
}

const ICON_MAP: Record<string, (compact: boolean) => ReactNode> = {
  linkedin: (c) => <LinkedInIcon className={c ? "h-3.5 w-3.5" : "h-[1.15rem] w-[1.15rem]"} />,
  scholar: (c) => <GoogleScholarIcon className={c ? "h-3.5 w-3.5" : "h-[1.15rem] w-[1.15rem]"} />,
  orcid: (c) => <OrcidIcon className={c ? "h-3.5 w-3.5" : "h-5 w-5"} />,
  website: (c) => <Globe className={c ? "h-3.5 w-3.5" : "h-[1.15rem] w-[1.15rem]"} strokeWidth={1.75} />,
  github: (c) => <Github className={c ? "h-3.5 w-3.5" : "h-[1.15rem] w-[1.15rem]"} strokeWidth={1.75} />,
};

export function MemberSocialLinks({
  member,
  variant,
  className,
}: {
  member: TeamMember;
  variant: SocialVariant;
  className?: string;
}) {
  const items = getSocialItems(member);
  if (items.length === 0) return null;

  const isCompact = variant === "compact";

  const wrap = cn(
    "inline-flex items-center justify-center shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rush-teal focus-visible:ring-offset-2 rounded-sm",
    variant === "pi" &&
      "w-10 h-10 bg-rush-secondary-container/35 text-rush-dark-green hover:bg-rush-secondary-container/80",
    variant === "staff-light" &&
      "w-9 h-9 text-rush-on-surface-variant hover:text-rush-dark-green hover:bg-rush-surface-container-high",
    variant === "staff-dark" &&
      "w-9 h-9 text-white/55 hover:text-rush-secondary-container hover:bg-white/10",
    variant === "compact" &&
      "w-7 h-7 text-rush-on-surface-variant/70 hover:text-rush-dark-green hover:bg-rush-surface-container-high"
  );

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        variant === "pi" && "gap-2.5",
        className
      )}
    >
      {items.map((item) => (
        <a
          key={item.key}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={wrap}
          title={item.label}
          aria-label={item.label}
        >
          {ICON_MAP[item.key]?.(isCompact)}
        </a>
      ))}
    </div>
  );
}
