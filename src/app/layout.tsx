import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const font = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  metadataBase: new URL("https://ricccsite.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${font.variable} ${GeistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-rush-surface text-rush-on-surface">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
