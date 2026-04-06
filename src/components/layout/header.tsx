"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { siteConfig } from "@/lib/config";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/mission", label: "Mission" },
  { href: "/research", label: "Research" },
  { href: "/team", label: "Team" },
  { href: "/publications", label: "Publications" },
  { href: "/tools", label: "Tools" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-rush-surface/80 backdrop-blur-xl shadow-card">
      <div className="flex items-center justify-between w-full max-w-screen-2xl mx-auto px-6 lg:px-8 h-16">
        {/* Logo + Name */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/riccc-logo-transparent.webp"
            alt={`${siteConfig.name} logo`}
            width={36}
            height={36}
            sizes="36px"
            className="rounded-sm object-contain"
          />
          <span className="text-xl font-bold tracking-tighter text-rush-dark-green">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`text-sm transition-colors ${
                  isActive
                    ? "text-rush-dark-green font-semibold border-b-2 border-rush-teal pb-1"
                    : "text-rush-on-surface-variant hover:text-rush-dark-green"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA + Mobile */}
        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="hidden sm:inline-flex bg-rush-dark-green text-white px-5 py-2 rounded-sm text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Collaborate
          </Link>

          {/* Mobile Hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="lg:hidden inline-flex items-center justify-center rounded-md p-2.5 text-rush-dark-green hover:bg-rush-surface-container-high">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="bg-rush-surface text-rush-dark-green border-rush-outline-variant">
              <SheetTitle className="text-rush-dark-green">{siteConfig.name}</SheetTitle>
              <nav className="flex flex-col gap-1 mt-6">
                {navItems.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname?.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`px-4 py-3 rounded-md text-base transition-colors ${
                        isActive
                          ? "bg-rush-surface-container-high font-semibold text-rush-dark-green"
                          : "text-rush-on-surface-variant hover:bg-rush-surface-container hover:text-rush-dark-green"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="mt-4 bg-rush-dark-green text-white px-4 py-3 rounded-md text-base font-medium text-center"
                >
                  Collaborate
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
