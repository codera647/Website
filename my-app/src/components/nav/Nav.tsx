"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/work", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export default function Nav() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => setOpen(false), [pathname]);

    // close the mobile menu with Escape
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <>
            <a
                href="#main"
                className="fixed left-4 top-[-56px] z-[60] rounded-full bg-ink px-5 py-2.5 font-heading text-sm font-semibold text-white transition-all focus:top-4"
            >
                Skip to content
            </a>
            <header
                className={`fixed inset-x-0 top-0 z-50 transition-all ${
                    scrolled
                        ? "border-b border-line bg-background/85 backdrop-blur-md"
                        : "border-b border-transparent"
                }`}
            >
                <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6">
                    <Link href="/" className="font-heading text-xl font-bold tracking-tight">
                        kinet<span className="text-muted">iq</span>
                    </Link>

                    <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                aria-current={isActive(link.href) ? "page" : undefined}
                                className={`rounded-full px-4 py-2 font-heading text-sm font-medium transition-colors ${
                                    isActive(link.href)
                                        ? "text-ink"
                                        : "text-muted hover:text-ink"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/contact"
                            className="ml-3 rounded-full bg-ink px-5 py-2.5 font-heading text-sm font-semibold text-white transition-colors hover:bg-ink-soft"
                        >
                            Let&apos;s talk
                        </Link>
                    </nav>

                    <button
                        className="flex size-10 flex-col items-center justify-center gap-1.5 md:hidden"
                        aria-label="Toggle menu"
                        aria-expanded={open}
                        onClick={() => setOpen(!open)}
                    >
                        <span
                            className={`h-0.5 w-6 bg-ink transition-transform ${open ? "translate-y-1 rotate-45" : ""}`}
                        />
                        <span
                            className={`h-0.5 w-6 bg-ink transition-transform ${open ? "-translate-y-1 -rotate-45" : ""}`}
                        />
                    </button>
                </div>
            </header>

            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 z-40 flex flex-col justify-center bg-background px-8 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <nav aria-label="Mobile" className="space-y-2">
                            {links.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.08 + i * 0.06 }}
                                >
                                    <Link
                                        href={link.href}
                                        className={`block border-b border-line py-4 font-heading text-3xl font-bold ${
                                            isActive(link.href) ? "text-ink" : "text-muted"
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
