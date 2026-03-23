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
  { href: "/research", label: "Research" },
  { href: "/team", label: "Team" },
  { href: "/publications", label: "Publications" },
  { href: "/software", label: "Software & Tools" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Don't show public header on admin pages
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="glass-nav text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo + Name */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/riccc-logo-v15.webp"
              alt={`${siteConfig.name} logo`}
              width={40}
              height={40}
              className="rounded"
            />
            <span className="text-lg font-semibold tracking-tight hidden sm:block">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm rounded-md transition-transform duration-300 hover:-translate-y-0.5 ${
                    isActive
                      ? "bg-white/20 font-medium"
                      : "hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="bg-rush-green text-white border-rush-green">
              <SheetTitle className="text-white">{siteConfig.name}</SheetTitle>
              <nav className="flex flex-col gap-2 mt-6">
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
                      className={`px-4 py-3 rounded-md text-base transition-colors duration-300 ${
                        isActive
                          ? "bg-white/20 font-medium"
                          : "hover:bg-white/10"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
