import Link from "next/link";
import FooterMaps from "@/components/nav/FooterMaps";

const CONTACT_EMAIL = "info@thekinetiq.solutions";
const LINKEDIN_URL = "https://www.linkedin.com/company/kinetiq-site/";
const INSTAGRAM_URL = "https://www.instagram.com/thekinetiq.solutions/";
/** opens Gmail's web compose (logged-in browser tab) instead of the
 *  OS default mail app, pre-addressed to us */
const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}`;

const sitemap = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/work", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
];

const socials = [
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
];

export default function Footer() {
    return (
        <footer className="border-t border-line bg-surface">
            <div className="container-wide grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr] md:py-20">
                <div>
                    <p className="font-heading text-2xl font-bold tracking-tight">
                        kinet<span className="text-muted">iq</span>
                    </p>
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
                        An AI automation, web development, and generative AI studio building
                        the software that powers what&apos;s next.
                    </p>
                    {/* the small brand flourish (brief §2) — the original tagline, kept in motion */}
                    <p className="mt-8 font-heading text-xs uppercase tracking-[0.3em] text-muted">
                        ⟳ always in motion
                    </p>
                </div>

                <nav aria-label="Footer">
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.24em] text-muted">
                        Site
                    </p>
                    <ul className="mt-4 space-y-2.5">
                        {sitemap.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="font-heading text-sm font-medium text-ink-soft hover:text-ink"
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
                            <a
                                href={GMAIL_COMPOSE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-ink-soft hover:text-ink"
                            >
                                {CONTACT_EMAIL}
                            </a>
                        </li>
                    </ul>

                    <div className="mt-5 flex items-center gap-3">
                        {socials.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.label}
                                className="flex size-9 items-center justify-center rounded-none border border-line text-ink-soft transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white"
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
