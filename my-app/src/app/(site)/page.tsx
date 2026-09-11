import Hero from "@/components/sections/Hero";
import ProofBand from "@/components/sections/ProofBand";
import ExpertiseGrid from "@/components/sections/ExpertiseGrid";
import FeaturedWork from "@/components/sections/FeaturedWork";
import ClientTrust from "@/components/sections/ClientTrust";
import FAQ from "@/components/sections/FAQ";
import ClosingCTA from "@/components/sections/ClosingCTA";
import { getAllProjects } from "@/lib/data";

export default async function Home() {
  const projects = await getAllProjects();
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <main>
      <Hero />
      <ExpertiseGrid />
      <FeaturedWork projects={featuredProjects} />
      <ProofBand projects={projects} />
      <ClientTrust />
      <FAQ />
      <ClosingCTA />
    </main>
  );
}
