import Hero from "@/components/sections/Hero";
import SystemsOverview from "@/components/systems/SystemsOverview";
import ExpertiseGrid from "@/components/sections/ExpertiseGrid";
import MarqueeBand from "@/components/sections/MarqueeBand";
import ClientTrust from "@/components/sections/ClientTrust";
import FAQ from "@/components/sections/FAQ";
import ClosingCTA from "@/components/sections/ClosingCTA";

export default async function Home() {
  return (
    <main>
      <Hero />
      <SystemsOverview />
      <ExpertiseGrid />
      <MarqueeBand />
      <ClientTrust />
      <FAQ />
      <ClosingCTA />
    </main>
  );
}
