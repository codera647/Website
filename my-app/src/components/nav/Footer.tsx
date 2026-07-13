import Link from "next/link";

const CONTACT_EMAIL = "info@thekinetiq.solutions";
const LINKEDIN_URL = "https://www.linkedin.com/company/kinetiq-site/";
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
                        <li>
                            <a
                                href={LINKEDIN_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-ink-soft hover:text-ink"
                            >
                                LinkedIn
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
