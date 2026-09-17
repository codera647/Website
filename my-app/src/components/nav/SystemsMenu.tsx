"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export const systemLinks = [
  {
    href: "/momentum-systems",
    label: "Momentum Systems",
    description: "Growth infrastructure",
  },
  {
    href: "/stratum-systems",
    label: "Stratum Systems",
    description: "Production AI engineering",
  },
  {
    href: "/pricing",
    label: "Pricing",
    description: "Compare systems and plans",
  },
];

/** Disclosure navigation uses normal links and native Tab order, rather than an application menu. */
export default function SystemsMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const id = useId();
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return (
    <div
      ref={container}
      className="relative hidden xl:block"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        className="flex min-h-11 items-center gap-3 border border-background/30 bg-background/5 px-4 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-background hover:bg-background/10"
      >
        <span aria-hidden="true" className="size-1.5 bg-background" />
        Systems<span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <nav
          id={id}
          aria-label="Systems"
          className="absolute left-0 top-full mt-3 w-72 border border-background/20 bg-ink p-2 shadow-xl"
        >
          {systemLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              onClick={() => setOpen(false)}
              className="block px-4 py-4 text-background hover:bg-background/10"
            >
              <span className="font-heading text-sm font-semibold">
                {link.label}
              </span>
              <span className="mt-1 block text-xs text-background/65">
                {link.description}
              </span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
