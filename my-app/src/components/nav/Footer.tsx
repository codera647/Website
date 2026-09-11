import Link from "next/link";
import FooterMaps from "@/components/nav/FooterMaps";
import BookCallButton from "@/components/booking/BookCallButton";
import { services } from "@/data/services";
import type { Project } from "@/lib/data";

const CONTACT_EMAIL = "info@thekinetiq.solutions";
const CONTACT_PHONE = "+1 917 914 8268";
const PHONE_CALL_URL = "tel:+19179148268";
const WHATSAPP_URL = "https://wa.me/19179148268";
const LINKEDIN_URL = "https://www.linkedin.com/company/kinetiq-site/";
const INSTAGRAM_URL = "https://www.instagram.com/thekinetiq.solutions/";
const YOUTUBE_URL = "https://www.youtube.com/@kinetiq-solutions";
const DISCORD_URL = "https://discord.gg/GJDe5SBJC";
const FACEBOOK_URL = "#";
const TWITTER_URL = "#";

/** opens Gmail's web compose (logged-in browser tab) instead of the
 *  OS default mail app, pre-addressed to us */
const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}`;

/**
 * Three topical link columns (Services / Work / Company) instead of one
 * flat sitemap list — same idea as a typical agency footer (lots of
 * scannable, categorized links), built from our own real content rather
 * than copied labels: service anchors from data/services.ts and actual
 * case studies from data/work.ts, so this stays correct as either changes.
 */
const serviceLinks = [
    { href: "/services", label: "Services overview" },
    ...services.map((s) => ({ href: `/services#${s.anchor}`, label: s.title })),
];

const companyLinks = [
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About Kinetiq" },
    { href: "/blog", label: "Blog" },
    { href: "/careers", label: "Careers" },
];

const socials = [
    {
        href: WHATSAPP_URL,
        label: "WhatsApp",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-[18px]">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.163 8.163 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.06 0 1.21.89 2.39 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.17-.48-.3z" />
            </svg>
        ),
    },
    {
        href: LINKEDIN_URL,
        label: "LinkedIn",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-[18px]">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.59 0 4.25 2.36 4.25 5.44v6.3zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
            </svg>
        ),
    },
    {
        href: INSTAGRAM_URL,
        label: "Instagram",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="size-[18px]">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
            </svg>
        ),
    },
    {
        href: YOUTUBE_URL,
        label: "YouTube",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-[18px]">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M21.58 7.2a2.27 2.27 0 0 0-1.6-1.6C18.25 5.2 12 5.2 12 5.2s-6.25 0-7.98.4a2.27 2.27 0 0 0-1.6 1.6A23.7 23.7 0 0 0 2 12a23.7 23.7 0 0 0 .42 4.8c.22.78.82 1.38 1.6 1.6 1.73.4 7.98.4 7.98.4s6.25 0 7.98-.4a2.27 2.27 0 0 0 1.6-1.6c.28-1.58.41-3.19.42-4.8a23.7 23.7 0 0 0-.42-4.8zM10 15.2V8.8l5.5 3.2z"
                />
            </svg>
        ),
    },
    {
        href: DISCORD_URL,
        label: "Discord",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-[18px]">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
        ),
    },
    {
        href: FACEBOOK_URL,
        label: "Facebook",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-[18px]">
                <path d="M13.5 21v-7.5h2.52l.38-3H13.5V8.5c0-.87.24-1.46 1.49-1.46h1.6V4.34c-.28-.04-1.22-.12-2.32-.12-2.3 0-3.87 1.4-3.87 3.98V10.5H8.2v3h2.7V21h2.6z" />
            </svg>
        ),
    },
    {
        href: TWITTER_URL,
        label: "X (Twitter)",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-[18px]">
                <path d="M13.6 10.6 20.3 3h-1.6l-5.8 6.6L8.3 3H3l7.3 10.4L3 21h1.6l6.1-7 5 7H21zM11 12.6l-.7-1L4.8 4.2h2.4l4.5 6.4.7 1 5.9 8.4h-2.4L11 12.6z" />
            </svg>
        ),
    },
];

export default function Footer({ featuredProjects }: { featuredProjects: Project[] }) {
    const workLinks = [
        ...featuredProjects.slice(0, 4).map((c) => ({ href: `/work/${c.slug}`, label: c.title })),
        { href: "/work", label: "All work" },
    ];

    return (
        <footer className="border-t border-line bg-surface">
            <div className="container-wide grid gap-x-8 gap-y-14 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.85fr_0.85fr_0.85fr_1fr] md:py-20">
                <div className="sm:col-span-2 lg:col-span-1">
                    <p className="font-heading text-2xl font-bold tracking-tight">
                        kinet<span className="text-muted">iq</span>
                    </p>
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
                        An AI automation, web development, and generative AI studio building
                        the software that powers what&apos;s next.
                    </p>
                    {/* the small brand flourish (brief §2) — the original tagline, kept in motion */}
                    <p className="mt-6 font-heading text-xs uppercase tracking-[0.3em] text-muted">
                        ⟳ always in motion
                    </p>

                    {/* Prominent Systems Block Button in Footer */}
                    <div className="mt-6">
                        <Link
                            href="/momentum-systems"
                            className="group inline-flex items-center gap-2.5 rounded-none border border-ink bg-ink px-4 py-2.5 font-heading text-xs font-bold uppercase tracking-[0.18em] text-background shadow-sm transition-all duration-300 hover:bg-background hover:text-ink hover:border-ink hover:shadow-[0_8px_24px_-12px_rgba(17,17,19,0.35)] hover:-translate-y-0.5"
                        >
                            <span className="relative flex size-2 shrink-0">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-background group-hover:bg-ink opacity-75 duration-1000" />
                                <span className="relative inline-flex size-2 rounded-full bg-background group-hover:bg-ink transition-colors" />
                            </span>
                            <span>Momentum Systems</span>
                            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </Link>
                    </div>
                </div>

                <nav aria-label="Services">
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.24em] text-muted">
                        Services
                    </p>
                    <ul className="mt-4 space-y-2.5">
                        {serviceLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="font-heading text-sm font-medium text-ink-soft underline-offset-4 transition-colors duration-300 hover:text-ink hover:underline"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <nav aria-label="Work">
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.24em] text-muted">
                        Work
                    </p>
                    <ul className="mt-4 space-y-2.5">
                        {workLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="font-heading text-sm font-medium text-ink-soft underline-offset-4 transition-colors duration-300 hover:text-ink hover:underline"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <nav aria-label="Company">
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.24em] text-muted">
                        Company
                    </p>
                    <ul className="mt-4 space-y-2.5">
                        {companyLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="font-heading text-sm font-medium text-ink-soft underline-offset-4 transition-colors duration-300 hover:text-ink hover:underline"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.24em] text-muted">
                        Get in touch
                    </p>
                    <ul className="mt-4 space-y-2.5 font-heading text-sm font-medium">
                        <li>
                            <BookCallButton
                                calLink="kinetiq-solutions/30min"
                                className="cursor-pointer text-ink font-semibold underline-offset-4 transition-colors duration-300 hover:underline"
                            >
                                Book a call →
                            </BookCallButton>
                        </li>
                        <li>
                            <a
                                href={PHONE_CALL_URL}
                                className="flex items-center gap-1.5 text-ink-soft underline-offset-4 transition-colors duration-300 hover:text-ink hover:underline"
                            >
                                <span>{CONTACT_PHONE}</span>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-muted">(Call)</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-emerald-600 font-semibold underline-offset-4 transition-colors duration-300 hover:text-emerald-700 hover:underline"
                            >
                                <span>WhatsApp: {CONTACT_PHONE}</span>
                                <span className="text-xs">↗</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href={GMAIL_COMPOSE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-ink-soft underline-offset-4 transition-colors duration-300 hover:text-ink hover:underline"
                            >
                                {CONTACT_EMAIL}
                            </a>
                        </li>
                    </ul>

                    {/* Social Media Links */}
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        {socials.filter((s) => s.href !== "#").map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.label}
                                className="flex size-9 items-center justify-center rounded-none border border-line text-ink-soft transition-all duration-300 hover:border-ink hover:bg-ink hover:text-background hover:-translate-y-0.5 shadow-sm"
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>

                    <FooterMaps />
                </div>
            </div>
        </footer>
    );
}
