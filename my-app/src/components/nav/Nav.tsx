"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SystemsMenu, { systemLinks } from "./SystemsMenu";
import BracketButton from "@/components/motion/BracketButton";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
];

/** The three brand "motion circles" from the logo, gently pulsing in sequence. */
function BrandDots() {
  const reducedMotion = useReducedMotion();
  const dots = ["#B5B5B5", "#888888", "#555555"];
  return (
    <span aria-hidden="true" className="ml-1.5 inline-flex items-center gap-1">
      {dots.map((color, i) => (
        <motion.span
          key={color}
          className="size-1.5 rounded-full"
          style={{ backgroundColor: color }}
          animate={
            reducedMotion
              ? { opacity: 1, scale: 1 }
              : { opacity: [0.35, 1, 0.35], scale: [0.85, 1.15, 0.85] }
          }
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: i * 0.25,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const mobilePanel = useRef<HTMLDivElement>(null);

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
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() =>
      mobilePanel.current?.querySelector<HTMLButtonElement>("button")?.focus(),
    );
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const controls =
          mobilePanel.current?.querySelectorAll<HTMLElement>("a, button");
        if (!controls?.length) return;
        const first = controls[0],
          last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-[-56px] z-[60] rounded-none bg-ink px-5 py-2.5 font-heading text-sm font-semibold text-background transition-all focus:top-4"
      >
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 bg-ink transition-all ${
          scrolled
            ? "border-b border-background/10 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.5)] backdrop-blur-md"
            : "border-b border-background/0"
        }`}
      >
        <div className="container-wide flex h-[72px] items-center justify-between">
          {/* Brand wordmark + Prominent Highlighted Systems Block */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="group flex items-baseline font-heading text-[1.7rem] font-bold leading-none tracking-tight text-background transition-opacity hover:opacity-90"
            >
              kinet
              <span className="text-background/45 transition-colors duration-300 group-hover:text-background/70">
                iq
              </span>
              <BrandDots />
            </Link>

            <SystemsMenu />
          </div>

          <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`group relative rounded-none px-4 py-2 font-heading text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-background"
                    : "text-background/50 hover:text-background"
                }`}
              >
                {link.label}
                {/* animated underline: grows from center on hover, stays for active */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-4 -bottom-0.5 h-px origin-center bg-background transition-transform duration-300 ease-out ${
                    isActive(link.href)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
            <BracketButton calLink="kinetiq-solutions/30min" className="ml-4">
              Let&apos;s talk
            </BracketButton>
          </nav>

          <button
            className="flex size-12 flex-col items-center justify-center gap-1.5 xl:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            <span
              className={`h-0.5 w-6 bg-background transition-transform ${open ? "translate-y-1 rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-6 bg-background transition-transform ${open ? "-translate-y-1 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={mobilePanel}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto bg-ink px-8 py-8 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mb-4 flex min-h-12 w-full items-center justify-between border-b border-background/20 font-heading text-sm text-background"
            >
              Close menu <span aria-hidden="true">×</span>
            </button>
            <nav
              aria-label="Mobile systems"
              className="mb-5 border-y border-background/20 py-3"
            >
              <p className="px-3 py-2 font-heading text-xs uppercase tracking-widest text-background/60">
                Systems
              </p>
              {systemLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center justify-between px-3 py-3 font-heading text-base font-semibold text-background hover:bg-background/10"
                >
                  {link.label}
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </nav>
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
                    onClick={() => setOpen(false)}
                    className={`block border-b border-background/10 py-3 font-heading text-2xl font-bold ${
                      isActive(link.href)
                        ? "text-background"
                        : "text-background/45"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-6">
                <BracketButton
                  calLink="kinetiq-solutions/30min"
                  onClick={() => setOpen(false)}
                  className="w-full text-center"
                >
                  Let&apos;s talk
                </BracketButton>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
