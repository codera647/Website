import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/motion/MotionProvider";
import Nav from "@/components/nav/Nav";
import Footer from "@/components/nav/Footer";
import BrandOutro from "@/components/nav/BrandOutro";
import SiteChatWidget from "@/components/chat/SiteChatWidget";
import CursorGrid from "@/components/effects/CursorGrid";
import RouteTransitionOverlay from "@/components/transitions/RouteTransitionOverlay";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kinetiq | We Engineer Intelligent Systems",
  description:
    "Kinetiq is an AI automation, web development, and generative AI studio building the software that powers what's next.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject
          attributes into <body> pre-hydration; this silences only attribute
          mismatches on this element, not real hydration bugs in children */}
      <body suppressHydrationWarning>
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
          background (bg-white/bg-surface/bg-ink etc. still fully cover it,
          same as any other page background) — mainly the page's own base
          fill and any gaps between sections.
        */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <CursorGrid
            cellSize={64}
            color="#111113"
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
        <MotionProvider>
          <Nav />
          {children}
          <Footer />
          <BrandOutro />
          <SiteChatWidget />
        </MotionProvider>
      </body>
    </html>
  );
}
