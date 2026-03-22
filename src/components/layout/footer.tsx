import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { SocialLinks } from "./social-links";

const footerNav = [
  { href: "/research", label: "Research" },
  { href: "/team", label: "Team" },
  { href: "/publications", label: "Publications" },
  { href: "/software", label: "Software & Tools" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="bg-rush-green text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Lab info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{siteConfig.name}</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              {siteConfig.institution}
              <br />
              {siteConfig.department}
              <br />
              {siteConfig.address}
            </p>
            <SocialLinks className="mt-4" />
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-white/50">
              Pages
            </h3>
            <nav className="flex flex-col gap-2">
              {footerNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-white/50">
              Resources
            </h3>
            <nav className="flex flex-col gap-2">
              {siteConfig.links.googleScholar && (
                <a
                  href={siteConfig.links.googleScholar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Google Scholar
                </a>
              )}
              {siteConfig.links.myNcbi && (
                <a
                  href={siteConfig.links.myNcbi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  MyNCBI
                </a>
              )}
              {siteConfig.links.clif && (
                <a
                  href={siteConfig.links.clif}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  CLIF Consortium
                </a>
              )}
            </nav>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/50">
          &copy; {new Date().getFullYear()} {siteConfig.name},{" "}
          {siteConfig.institution}
        </div>
      </div>
    </footer>
  );
}
