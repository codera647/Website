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
        default: "Kinetiq | AI Automation, Web Development & Momentum Systems Studio",
        template: "%s | Kinetiq",
    },
    description:
        "Kinetiq is a high-performance software and AI engineering studio. We build production AI automations, scalable Next.js web platforms, and Momentum Systems for businesses across the US, UK, Pakistan, and worldwide.",
    keywords: [
        // US & Global High-Intent Targets
        "AI Automation Agency",
        "AI Automation for Service Businesses",
        "Custom Software Development Studio US",
        "HVAC Customer Portal Software",
        "Automated Repeat Booking System",
        "Programmatic SEO Agency",
        "Next.js 15 Web Development Studio",
        "Enterprise RAG System Developers",
        // UK Targets
        "Bespoke Software Engineering Studio UK",
        "AI Workflow Automation Agency London",
        "Client Portal Software Development UK",
        // Pakistan & Offshore Global Targets
        "Top Software Development Studio in Pakistan",
        "Hire Dedicated Senior AI Engineering Team",
        "Enterprise Generative AI Developers",
        "Cloudflare Edge Web Engineering",
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
        languages: {
            "en-US": "https://thekinetiq.solutions",
            "en-GB": "https://thekinetiq.solutions",
            "en-PK": "https://thekinetiq.solutions",
            "x-default": "https://thekinetiq.solutions",
        },
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        alternateLocale: ["en_GB", "en_PK"],
        url: "https://thekinetiq.solutions",
        siteName: "Kinetiq",
        title: "Kinetiq | AI Automation, Web Development & Momentum Systems Studio",
        description:
            "High-performance software and AI engineering studio. We build production AI automations, scalable full-stack web platforms, and autonomous growth engines.",
    },
    twitter: {
        card: "summary_large_image",
        title: "Kinetiq | AI Automation & Momentum Systems",
        description:
            "Software and AI engineering studio building production systems that generate measurable business outcomes.",
    },
    other: {
        "geo.region": "US, GB, PK",
        "geo.position": "37.7749;-122.4194",
        "ICBM": "37.7749, -122.4194",
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
            areaServed: [
                {
                    "@type": "Country",
                    name: "United States",
                },
                {
                    "@type": "Country",
                    name: "United Kingdom",
                },
                {
                    "@type": "Country",
                    name: "Pakistan",
                },
                {
                    "@type": "GeoShape",
                    name: "Global / Worldwide",
                },
            ],
            knowsAbout: [
                "Artificial Intelligence Automation",
                "Next.js Full-Stack Web Development",
                "Retrieval-Augmented Generation (RAG)",
                "Momentum Systems for Local Service Businesses",
                "Programmatic SEO Architecture",
                "CRM 2-Way Sync Integration",
                "Autonomous Agentic Workflows",
            ],
            founders: [
                {
                    "@type": "Person",
                    name: "Abdul Moiz",
                    jobTitle: "CEO & CTO",
                    url: "https://thekinetiq.solutions/about",
                },
                {
                    "@type": "Person",
                    name: "Hammad Sarwar",
                    jobTitle: "COO & CMO",
                    url: "https://thekinetiq.solutions/about",
                },
            ],
            sameAs: [
                "https://wa.me/447427114280",
                "https://www.linkedin.com/company/kinetiq-site/",
                "https://www.instagram.com/thekinetiq.solutions/",
                "https://www.youtube.com/@kinetiq-solutions",
                "https://discord.gg/GJDe5SBJC",
            ],
            contactPoint: {
                "@type": "ContactPoint",
                email: "info@thekinetiq.solutions",
                telephone: "+44 7427 114280",
                contactType: "customer service & sales",
                availableLanguage: ["English", "Urdu"],
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
