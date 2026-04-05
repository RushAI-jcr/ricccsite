import { Github, ExternalLink } from "lucide-react";
import { GoogleScholarIcon } from "@/components/icons/brand-social";
import { siteConfig } from "@/lib/config";

const scholarLinks = siteConfig.links.googleScholarProfiles.map((p) => ({
  label: `Google Scholar — ${p.name}`,
  href: p.url,
  icon: GoogleScholarIcon,
}));

const links = [
  ...scholarLinks,
  {
    label: "GitHub",
    href: siteConfig.links.github,
    icon: Github,
  },
  {
    label: "CLIF Consortium",
    href: siteConfig.links.clif,
    icon: ExternalLink,
  },
];

export function SocialLinks({ className = "" }: { className?: string }) {
  const activeLinks = links.filter((l) => l.href);

  if (activeLinks.length === 0) return null;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {activeLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rush-on-surface-variant hover:text-rush-dark-green transition-colors"
            aria-label={link.label}
          >
            <Icon className="h-5 w-5" />
          </a>
        );
      })}
    </div>
  );
}
