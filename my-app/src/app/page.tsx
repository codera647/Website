import Hero from "@/components/sections/Hero";
import ProofBand from "@/components/sections/ProofBand";
import ExpertiseGrid from "@/components/sections/ExpertiseGrid";
import MarqueeBand from "@/components/sections/MarqueeBand";
import FeaturedWork from "@/components/sections/FeaturedWork";
import ClientTrust from "@/components/sections/ClientTrust";
import FAQ from "@/components/sections/FAQ";
import ClosingCTA from "@/components/sections/ClosingCTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProofBand />
      <ExpertiseGrid />
      <MarqueeBand />
      <FeaturedWork />
      <ClientTrust />
      <FAQ />
      <ClosingCTA />
    </main>
  );
}
