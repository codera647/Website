import type { Metadata } from "next";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import StaggerList from "@/components/motion/StaggerList";
import { RoleCard } from "@/components/sections/RoleCard";
import OpenApplicationForm from "@/components/sections/OpenApplicationForm";
import { getAllJobs, type Job } from "@/lib/data";
import { roles as fallbackRoles } from "@/data/careers";

export const metadata: Metadata = {
    title: "Careers at Kinetiq | Senior Engineering & AI Roles",
    description:
        "Join Kinetiq's senior engineering studio. Explore remote open positions for Web Developers, SEO Engineers, and AI Automation specialists across the US, UK, Pakistan, and worldwide.",
    keywords: [
        "Kinetiq Careers",
        "Remote Web Developer Jobs",
        "SEO Engineer Careers",
        "AI Automation Engineer Jobs",
        "Next.js Developer Hiring",
        "Software House Jobs in Pakistan",
    ],
    alternates: {
        canonical: "/careers",
    },
    openGraph: {
        title: "Careers at Kinetiq | Senior Engineering & AI Roles",
        description:
            "Join Kinetiq's senior engineering studio. Explore remote open positions for Web Developers, SEO Engineers, and AI specialists.",
        url: "https://thekinetiq.solutions/careers",
        siteName: "Kinetiq",
        type: "website",
    },
};

export default async function CareersPage() {
    let jobs: Job[] = [];
    try {
        jobs = await getAllJobs(true);
    } catch (e) {
        console.error("Failed to load jobs from D1, using fallback roles:", e);
    }

    const displayedRoles = jobs.length > 0 ? jobs : fallbackRoles;
    const openRoleTitles = displayedRoles.map((r) => r.title);

    const careersSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://thekinetiq.solutions",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Careers",
                item: "https://thekinetiq.solutions/careers",
            },
        ],
    };

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(careersSchema) }}
            />
            <section className="container-wide pb-10 pt-36 md:pt-44">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        Careers &amp; Opportunities
                    </p>
                    <h1 className="mt-4 max-w-2xl font-heading text-5xl font-bold tracking-tight text-ink md:text-6xl">
                        Build what&apos;s next, with us.
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                        We&apos;re a high-cadence engineering studio shipping real production systems,
                        not slide decks. Explore our active openings below or send us an open application.
                    </p>
                </FadeInWhenVisible>
            </section>

            {displayedRoles.length > 0 ? (
                <section className="container-wide pb-24 pt-10 md:pb-32">
                    <StaggerList
                        className="grid gap-6 transition-[padding-bottom] duration-500 ease-out md:grid-cols-2 md:has-[:hover]:pb-64"
                        itemClassName="h-full"
                        stagger={0.1}
                    >
                        {displayedRoles.map((role) => (
                            <RoleCard key={role.slug} role={role} />
                        ))}
                    </StaggerList>
                </section>
            ) : (
                <section className="container-wide pb-24 md:pb-28">
                    <FadeInWhenVisible y={24}>
                        <div className="rounded-2xl border border-line bg-surface px-8 py-14 text-center md:py-16">
                            <p className="font-heading text-2xl font-semibold text-ink md:text-3xl">
                                No open roles right now.
                            </p>
                            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                                We&apos;re not actively hiring, but we&apos;re always glad
                                to hear from talented people doing great work. If that&apos;s you,
                                drop your CV below. We read every application.
                            </p>
                            <a
                                href="#send-cv"
                                className="mt-7 inline-flex items-center gap-1.5 rounded-none bg-ink px-6 py-3 font-heading text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink-soft hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.45)]"
                            >
                                Send your CV
                                <span aria-hidden="true">↓</span>
                            </a>
                        </div>
                    </FadeInWhenVisible>
                </section>
            )}

            {/* open application — always available, opening or not */}
            <section id="send-cv" className="scroll-mt-24 bg-ink">
                <div className="mx-auto max-w-4xl px-6 py-20 md:py-24">
                    <FadeInWhenVisible>
                        <div className="text-center">
                            <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-white/45">
                                Open application
                            </p>
                            <h2 className="mt-4 font-heading text-3xl font-bold text-white md:text-4xl">
                                Don&apos;t see your role? Send your CV.
                            </h2>
                            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/60">
                                Pick one of our openings, or tell us the role you think
                                we need. A real person reads every application.
                            </p>
                        </div>
                        <div className="mt-10">
                            <OpenApplicationForm openRoles={openRoleTitles} />
                        </div>
                    </FadeInWhenVisible>
                </div>
            </section>
        </main>
    );
}
