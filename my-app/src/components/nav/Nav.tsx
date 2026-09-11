"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BracketButton from "@/components/motion/BracketButton";

const links = [
    { href: "/momentum-systems", label: "Momentum Systems" },
    { href: "/services", label: "Services" },
    { href: "/work", label: "Work" },
    { href: "/about", label: "About" },
];
const secondaryLinks = [
    { href: "/pricing", label: "Pricing" },
    { href: "/ai-engagements", label: "Custom AI" },
    { href: "/blog", label: "Blog" },
    { href: "/careers", label: "Careers" },
];

export default function Nav() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [more, setMore] = useState(false);
    const menuButton = useRef<HTMLButtonElement>(null);
    const moreButton = useRef<HTMLButtonElement>(null);
    const morePanel = useRef<HTMLDivElement>(null);
    const mobilePanel = useRef<HTMLDivElement>(null);

    useEffect(() => { setOpen(false); setMore(false); }, [pathname]);
    useEffect(() => {
        if (!open && !more) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false); setMore(false);
                (open ? menuButton : moreButton).current?.focus();
            }
            if (open && event.key === "Tab") {
                const items = [menuButton.current, ...Array.from(mobilePanel.current?.querySelectorAll<HTMLElement>('a, button') ?? [])].filter(Boolean) as HTMLElement[];
                const first = items[0];
                const last = items[items.length - 1];
                if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
                if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
            }
        };
        const outside = (event: PointerEvent) => {
            if (!morePanel.current?.contains(event.target as Node)) setMore(false);
        };
        window.addEventListener("keydown", onKey);
        window.addEventListener("pointerdown", outside);
        return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("pointerdown", outside); };
    }, [open, more]);
    useEffect(() => {
        if (!open) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const breakpoint = window.matchMedia("(min-width: 1024px)");
        const closeAtDesktop = () => { if (breakpoint.matches) setOpen(false); };
        breakpoint.addEventListener("change", closeAtDesktop);
        return () => { document.body.style.overflow = previous; breakpoint.removeEventListener("change", closeAtDesktop); };
    }, [open]);
    const active = (href: string) => pathname.startsWith(href);

    return (
        <>
            <a href="#main" className="fixed left-4 top-[-60px] z-[60] bg-background px-5 py-3 font-heading text-sm font-semibold text-ink focus:top-4">Skip to content</a>
            <header className="fixed inset-x-0 top-0 z-50 border-b border-background/15 bg-ink text-background">
                <div className="container-wide flex h-[72px] items-center justify-between gap-6">
                    <Link href="/" aria-label="Kinetiq home" onClick={() => setOpen(false)} className="font-heading text-[1.7rem] font-bold tracking-tight">kinet<span className="text-background/70">iq</span><span aria-hidden="true" className="ml-1 text-accent">···</span></Link>
                    <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
                        {links.map((link) => <Link key={link.href} href={link.href} aria-current={active(link.href) ? "page" : undefined}
                            className={`border-b-2 px-3 py-3 font-heading text-sm font-medium transition-colors ${active(link.href) ? "border-accent text-background" : "border-transparent text-background/80 hover:text-background"}`}>{link.label}</Link>)}
                        <div ref={morePanel} className="relative" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setMore(false); }}>
                            <button ref={moreButton} type="button" aria-expanded={more} aria-controls="secondary-navigation" onClick={() => setMore(!more)} className="min-h-11 cursor-pointer px-3 font-heading text-sm text-background/80 hover:text-background">More <span aria-hidden="true">⌄</span></button>
                            {more && <nav id="secondary-navigation" aria-label="More" className="absolute right-0 top-full w-52 border border-background/20 bg-ink p-2 shadow-xl">
                                {secondaryLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setMore(false)} className="block px-4 py-3 text-sm text-background/85 hover:bg-background/10">{link.label}</Link>)}
                            </nav>}
                        </div>
                        <BracketButton calLink="kinetiq-solutions/30min" className="ml-5">Book a call</BracketButton>
                    </nav>
                    <button ref={menuButton} type="button" className="flex size-11 flex-col items-center justify-center gap-1.5 lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
                        <span className={`h-0.5 w-6 bg-background transition-transform ${open ? "translate-y-1 rotate-45" : ""}`} />
                        <span className={`h-0.5 w-6 bg-background transition-transform ${open ? "-translate-y-1 -rotate-45" : ""}`} />
                    </button>
                </div>
            </header>
            {open && <div ref={mobilePanel} id="mobile-navigation" className="fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto bg-ink px-6 pb-12 pt-6 text-background lg:hidden">
                <nav aria-label="Mobile">
                    {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={active(link.href) ? "page" : undefined}
                        className="block border-b border-background/20 py-4 font-heading text-2xl font-semibold">{link.label}</Link>)}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 py-5">
                        {secondaryLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="py-3 text-base text-background/80">{link.label}</Link>)}
                    </div>
                    <BracketButton calLink="kinetiq-solutions/30min" onClick={() => setOpen(false)}>Book a discovery call</BracketButton>
                </nav>
            </div>}
        </>
    );
}
