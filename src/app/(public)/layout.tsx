import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/config";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ResearchOrganization",
  name: "RICCC",
  alternateName:
    "Rush Interdisciplinary Consortium for Critical Care Trials and Data Science",
  url: siteConfig.url,
  logo: `${siteConfig.url}/images/riccc-logo-transparent.webp`,
  description:
    "ICU data science and clinical trials lab at Rush University, Chicago",
  foundingDate: "2025",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chicago",
    addressRegion: "IL",
    addressCountry: "US",
  },
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: "Rush University System for Health",
    url: "https://www.rush.edu",
  },
  member: [
    {
      "@type": "Person",
      name: "Juan C. Rojas",
      jobTitle: "Assistant Professor",
    },
    {
      "@type": "Person",
      name: "Kevin Buell",
      jobTitle: "Assistant Professor",
    },
  ],
  sameAs: [
    "https://github.com/riccc-rush-lab",
    "https://scholar.google.com/citations?user=XXHTvWEAAAAJ",
  ],
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
