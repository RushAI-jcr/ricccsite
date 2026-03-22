import siteConfigData from "../../content/site-config.json";

interface SiteConfig {
  name: string;
  fullName: string;
  institution: string;
  department: string;
  address: string;
  tagline: string;
  pubmedQuery: string;
  pi: { name: string; credentials: string; title: string; email: string };
  links: {
    googleScholar: string;
    myNcbi: string;
    github: string;
    clif: string;
  };
}

export const siteConfig: SiteConfig = {
  name: siteConfigData.lab_name,
  fullName: siteConfigData.full_name,
  institution: "Rush University Medical Center",
  department: "Department of Medicine",
  address: "Chicago, IL",
  tagline: siteConfigData.tagline,
  pubmedQuery: siteConfigData.pubmed_query,
  pi: siteConfigData.pi,
  links: {
    googleScholar: siteConfigData.links.google_scholar,
    myNcbi: siteConfigData.links.my_ncbi,
    github: siteConfigData.links.github,
    clif: siteConfigData.links.clif,
  },
};
