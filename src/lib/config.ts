import siteConfigData from "../../content/site-config.json";

interface SiteConfig {
  name: string;
  fullName: string;
  url: string;
  institution: string;
  department: string;
  address: string;
  tagline: string;
  pubmedQuery: string;
  authors: string[];
  openalexAuthors: { name: string; id: string }[];
  excludeTitlePatterns: string[];
  metrics: { publications: number; activeProjects: number; teamMembers: number; founded: number };
  pi: { name: string; credentials: string; title: string; email: string };
  links: {
    googleScholar: string;
    myNcbi: string;
    github: string;
    twitter: string;
    bluesky: string;
    clif: string;
  };
}

export const siteConfig: SiteConfig = {
  name: siteConfigData.lab_name,
  fullName: siteConfigData.full_name,
  url: "https://riccc-lab.com",
  institution: "Rush University System for Health",
  department: "Department of Medicine",
  address: "Chicago, IL",
  tagline: siteConfigData.tagline,
  pubmedQuery: siteConfigData.pubmed_query,
  authors: siteConfigData.authors ?? [siteConfigData.pi.name],
  openalexAuthors: siteConfigData.openalex_authors ?? [],
  excludeTitlePatterns: siteConfigData.exclude_title_patterns ?? [],
  metrics: {
    publications: siteConfigData.metrics?.publications ?? 50,
    activeProjects: siteConfigData.metrics?.active_projects ?? 8,
    teamMembers: siteConfigData.metrics?.team_members ?? 15,
    founded: siteConfigData.metrics?.founded ?? 2020,
  },
  pi: siteConfigData.pi,
  links: {
    googleScholar: siteConfigData.links.google_scholar,
    myNcbi: siteConfigData.links.my_ncbi,
    github: siteConfigData.links.github,
    twitter: siteConfigData.links.twitter ?? "",
    bluesky: siteConfigData.links.bluesky ?? "",
    clif: siteConfigData.links.clif,
  },
};
