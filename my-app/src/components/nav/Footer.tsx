import Link from "next/link";

/** TODO(user): real social URLs + confirm public email. */
const CONTACT_EMAIL = "nex.gen.3023@gmail.com";

const sitemap = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/work", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export default function Footer() {
    return (
        <footer className="border-t border-line bg-surface">
            <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.5fr_1fr_1fr] md:py-20">
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
                            <a href={`mailto:${CONTACT_EMAIL}`} className="text-ink-soft hover:text-ink">
                                {CONTACT_EMAIL}
                            </a>
                        </li>
                        <li className="text-muted">LinkedIn [TODO]</li>
                        <li className="text-muted">GitHub [TODO]</li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-line">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-6 text-xs text-muted">
                    <p>© {new Date().getFullYear()} Kinetiq. All rights reserved.</p>
                    <p>Engineered by Kinetiq — naturally.</p>
                </div>
            </div>
        </footer>
    );
}
