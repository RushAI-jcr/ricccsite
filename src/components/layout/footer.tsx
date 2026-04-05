import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { SocialLinks } from "./social-links";

const footerNav = [
  { href: "/mission", label: "Mission & Goals" },
  { href: "/research", label: "Research" },
  { href: "/team", label: "Team" },
  { href: "/publications", label: "Publications" },
  { href: "/tools", label: "Tools" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

const resources = [
  { href: siteConfig.links.googleScholar, label: "Google Scholar", external: true },
  { href: siteConfig.links.github, label: "GitHub", external: true },
  { href: siteConfig.links.clif, label: "CLIF Consortium", external: true },
];

export function Footer() {
  return (
    <footer className="bg-rush-surface-container border-t border-rush-outline-variant/10">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Lab info */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-lg text-rush-dark-green">
                {siteConfig.name}
              </span>
            </div>
            <p className="font-mono uppercase text-xs tracking-widest text-rush-on-surface-variant leading-relaxed">
              {siteConfig.institution}
              <br />
              {siteConfig.department}
              <br />
              {siteConfig.address}
            </p>
            <SocialLinks className="mt-4" />
          </div>

          {/* Navigation + Resources */}
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <nav aria-label="Footer navigation" className="flex flex-col gap-1">
              <span className="font-mono uppercase text-xs font-bold tracking-widest text-rush-dark-green mb-2">
                Navigation
              </span>
              {footerNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-mono uppercase text-xs tracking-widest text-rush-on-surface-variant hover:text-rush-dark-green transition-colors py-1.5"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-1">
              <span className="font-mono uppercase text-xs font-bold tracking-widest text-rush-dark-green mb-2">
                Resources
              </span>
              {resources.filter((item) => item.href).map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono uppercase text-xs tracking-widest text-rush-on-surface-variant hover:text-rush-dark-green transition-colors py-1.5"
                  >
                    {item.label}
                  </a>
                ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-rush-outline-variant/10">
          <p className="font-mono uppercase text-xs tracking-widest text-rush-on-surface-variant">
            &copy; {new Date().getFullYear()} {siteConfig.name}.{" "}
            {siteConfig.institution}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
