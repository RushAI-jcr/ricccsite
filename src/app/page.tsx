import { Hero } from "@/components/home/hero";
import { MetricsBar } from "@/components/home/metrics-bar";
import { ResearchSpotlights } from "@/components/home/research-spotlights";
import { FundingLogos } from "@/components/home/funding-logos";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MetricsBar />
      <ResearchSpotlights />
      <FundingLogos />
    </>
  );
}
