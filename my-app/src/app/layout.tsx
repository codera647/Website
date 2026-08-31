import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/motion/MotionProvider";

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
    metadataBase: new URL("https://thekinetiq.solutions"),
    title: {
        default: "Kinetiq | AI Automation, Web Development & Momentum Systems",
        template: "%s | Kinetiq",
    },
    description:
        "Kinetiq engineers intelligent systems — AI automation, modern web development, generative AI, and Momentum Systems: growth engines that turn local businesses' online presence into a system that books more repeat customers automatically.",
    keywords: [
        "AI Automation",
        "Web Development Studio",
        "Generative AI Engineering",
        "Momentum Systems",
        "Programmatic SEO",
        "Customer Portal",
        "HVAC Automation",
        "Local Business Growth Systems",
        "Next.js Development",
        "Cloudflare Edge",
    ],
    authors: [
        { name: "Abdul Moiz", url: "https://thekinetiq.solutions/about" },
        { name: "Hammad Sarwar", url: "https://thekinetiq.solutions/about" },
    ],
    creator: "Kinetiq",
    publisher: "Kinetiq",
    formatDetection: {
        email: true,
        address: false,
        telephone: true,
    },
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://thekinetiq.solutions",
        siteName: "Kinetiq",
        title: "Kinetiq | AI Automation, Web Development & Momentum Systems",
        description:
            "High-performance software and AI engineering studio. We build production AI automations, scalable full-stack web platforms, and autonomous growth engines.",
    },
    twitter: {
        card: "summary_large_image",
        title: "Kinetiq | AI Automation & Momentum Systems",
        description:
            "Software and AI engineering studio building production systems that generate measurable business outcomes.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

const jsonLdOrganization = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": "https://thekinetiq.solutions/#organization",
            name: "Kinetiq",
            url: "https://thekinetiq.solutions",
            logo: "https://thekinetiq.solutions/icon.png",
            description:
                "High-performance software engineering studio specializing in AI Automation, Web Development, Generative AI, and Momentum Systems.",
            email: "info@thekinetiq.solutions",
            foundingDate: "2024",
            founders: [
                {
                    "@type": "Person",
                    name: "Abdul Moiz",
                    jobTitle: "CEO & CTO",
                },
                {
                    "@type": "Person",
                    name: "Hammad Sarwar",
                    jobTitle: "COO & CMO",
                },
            ],
            sameAs: [
                "https://www.linkedin.com/company/kinetiq-site/",
                "https://www.instagram.com/thekinetiq.solutions/",
                "https://www.youtube.com/@kinetiq-solutions",
                "https://discord.gg/GJDe5SBJC",
            ],
            contactPoint: {
                "@type": "ContactPoint",
                email: "info@thekinetiq.solutions",
                contactType: "customer support",
            },
        },
        {
            "@type": "WebSite",
            "@id": "https://thekinetiq.solutions/#website",
            url: "https://thekinetiq.solutions",
            name: "Kinetiq",
            publisher: {
                "@id": "https://thekinetiq.solutions/#organization",
            },
        },
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
                />
            </head>
            <body suppressHydrationWarning>
                <MotionProvider>{children}</MotionProvider>
            </body>
        </html>
    );
}
