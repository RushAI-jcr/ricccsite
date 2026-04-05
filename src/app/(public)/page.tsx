import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { LabMission } from "@/components/home/lab-mission";
import { ResearchSpotlights } from "@/components/home/research-spotlights";

export const metadata: Metadata = {
  title:
    "RICCC | ICU Data Science, AI & Clinical Trials at Rush University, Chicago",
  description:
    "The Rush Interdisciplinary Consortium for Critical Care (RICCC) — led by Juan C. Rojas (J.C. Rojas) and Kevin Buell — advances ICU data science, AI, clinical trials, and federated research through the CLIF consortium at Rush University Medical Center in Chicago.",
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
