import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/motion/MotionProvider";
import Nav from "@/components/nav/Nav";
import Footer from "@/components/nav/Footer";
import BrandOutro from "@/components/nav/BrandOutro";
import SiteChatWidget from "@/components/chat/SiteChatWidget";

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
  title: "Kinetiq — We Engineer Intelligent Systems",
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
