import { Github, ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/config";

const links = [
  {
    label: "Google Scholar",
    href: siteConfig.links.googleScholar,
    icon: () => (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
      </svg>
    ),
  },
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
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white transition-colors"
            aria-label={link.label}
          >
            <Icon className="h-5 w-5" />
          </a>
        );
      })}
    </div>
  );
}
