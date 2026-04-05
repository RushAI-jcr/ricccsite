import { Hero } from "@/components/home/hero";
import { LabMission } from "@/components/home/lab-mission";
import { ResearchSpotlights } from "@/components/home/research-spotlights";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <LabMission />
      <ResearchSpotlights />
    </main>
  );
}
