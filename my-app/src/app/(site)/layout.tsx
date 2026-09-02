import Nav from "@/components/nav/Nav";
import Footer from "@/components/nav/Footer";
import BrandOutro from "@/components/nav/BrandOutro";
import SiteChatWidget from "@/components/chat/SiteChatWidget";
import CallTypeModal from "@/components/booking/CallTypeModal";
import CursorGrid from "@/components/effects/CursorGrid";
import RouteTransitionOverlay from "@/components/transitions/RouteTransitionOverlay";
import { getFeaturedProjects } from "@/lib/data";

/**
 * Public site shell — Nav, Footer, chat widget, and background/transition
 * effects. Scoped to the `(site)` route group so `/admin` gets its own
 * minimal layout instead of inheriting all of this.
 *
 * Footer reads featured projects from D1, so every page under this group
 * renders dynamically (per-request) rather than being statically cached —
 * an accepted tradeoff (see implementation_plan.md) given D1's edge latency.
 */
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const featuredProjects = await getFeaturedProjects();

  return (
    <>
      {/* Loading / route-transition overlay — plays once on first paint,
          then again on every client-side navigation. See the component
          for how it was derived from public/refrence_video.mp4. Mounted
          once here (outside {children}) so App Router swapping the route
          segment underneath doesn't remount it mid-cycle. */}
      <RouteTransitionOverlay />
      {/*
        Site-wide interactive background (React Bits' CursorGrid, ported
        to our monochrome palette — see CursorGrid.tsx). Fixed behind
        everything at -z-10 so it stays put while the page scrolls, and
        pointer-events-none so it never intercepts clicks on real content.
        It's only visible wherever a section doesn't paint its own solid
        background (bg-background/bg-surface/bg-ink etc. still fully cover it,
        same as any other page background) — mainly the page's own base
        fill and any gaps between sections.
      */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <CursorGrid
          cellSize={64}
          color="#7E6921"
          radius={160}
          falloff="smooth"
          holdTime={350}
          fadeDuration={900}
          lineWidth={1}
          maxOpacity={0.35}
          fillOpacity={0}
          gridOpacity={0.035}
          cellRadius={0}
          clickPulse
          pulseSpeed={650}
        />
      </div>
      <Nav />
      {children}
      <Footer featuredProjects={featuredProjects} />
      <BrandOutro />
      <SiteChatWidget />
      <CallTypeModal />
    </>
  );
}
