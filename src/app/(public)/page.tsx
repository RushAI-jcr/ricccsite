import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { LabMission } from "@/components/home/lab-mission";
import { ResearchSpotlights } from "@/components/home/research-spotlights";

export const metadata: Metadata = {
  title: "RICCC | ICU Data Science & AI Lab at Rush, Chicago",
  description:
    "ICU data science, AI, and clinical trials at Rush University — led by J.C. Rojas and Kevin Buell. Federated ICU research through the CLIF consortium.",
  openGraph: { url: "/" },
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <LabMission />
      <ResearchSpotlights />
    </main>
  );
}
