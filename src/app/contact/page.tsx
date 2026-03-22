import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { GraduationCap, Users, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the RICCC Lab",
};

const pathways = [
  {
    title: "Prospective Students",
    description:
      "Interested in joining our lab? We welcome students passionate about data science and clinical research. Reach out to discuss opportunities.",
    icon: GraduationCap,
    cta: "Inquire About Positions",
    subject: "Prospective Student Inquiry",
  },
  {
    title: "Collaborators",
    description:
      "Looking to collaborate on clinical data science, AI in critical care, or healthcare equity research? We are always open to new partnerships.",
    icon: Users,
    cta: "Discuss Collaboration",
    subject: "Collaboration Inquiry",
  },
  {
    title: "General Inquiry",
    description: `${siteConfig.institution}\n${siteConfig.department}\n${siteConfig.address}`,
    icon: Mail,
    cta: "Send Email",
    subject: "General Inquiry",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-rush-green mb-4">
        Contact & Join
      </h1>
      <p className="text-rush-mid-gray text-lg mb-12 max-w-2xl">
        Choose the pathway that best describes you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pathways.map((pathway) => {
          const Icon = pathway.icon;
          const mailto = `mailto:${siteConfig.pi.email}?subject=${encodeURIComponent(
            `[${siteConfig.name}] ${pathway.subject}`
          )}`;

          return (
            <div
              key={pathway.title}
              className="bg-white rounded-xl p-8 shadow-sm flex flex-col"
            >
              <div className="w-12 h-12 rounded-lg bg-rush-teal flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-rush-charcoal mb-3">
                {pathway.title}
              </h2>
              <p className="text-rush-mid-gray leading-relaxed mb-6 flex-1 whitespace-pre-line">
                {pathway.description}
              </p>
              <a
                href={mailto}
                className="inline-flex items-center justify-center rounded-lg bg-rush-teal px-4 py-3 text-sm font-medium text-white hover:bg-rush-green transition-colors"
              >
                {pathway.cta}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
