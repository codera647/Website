"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { services } from "@/data/services";
import { team } from "@/data/team";

const TAGLINE = "Always in motion.";
const SUBHEAD =
    "A studio engineering intelligent systems. We deliver AI automation, web development, and generative AI that power what's next.";

/** value keywords surfaced right in the hero (full cards live on /about) */
const VALUE_CHIPS = [
    "Practical over flashy",
    "Engineering rigor",
    "Transparency",
    "Always in motion",
];

/** the three brand motion circles, scaled up for the hero wordmark */
function HeroDots() {
    const dots = ["#B5B5B5", "#888888", "#555555"];
    return (
        <span
            aria-hidden="true"
            className="ml-3 inline-flex items-center gap-2 align-baseline md:ml-5 md:gap-3"
        >
            {dots.map((color, i) => (
                <motion.span
                    key={color}
                    className="size-3 rounded-full md:size-5"
                    style={{ backgroundColor: color }}
                    animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        delay: i * 0.22,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </span>
    );
}

/**
 * Small "peek" of the team, pinned to the hero's right margin next to the
 * empty space beside the wordmark. At rest it's just the two avatars,
 * overlapping like a stacked-avatar CTA; on hover a text bar unfurls to
 * their left (grid-template-columns 0fr→1fr — same width-reveal trick the
 * work cards use for height) and the avatars themselves nudge left a touch,
 * so the whole thing reads as "dragging open." Links to the team section
 * on the About page. Desktop-only — there's no equivalent empty space
 * beside the wordmark once it wraps on smaller screens.
 */
function HeroTeamPeek() {
    return (
        <motion.div
            className="pointer-events-auto absolute right-0 top-40 z-10 hidden lg:top-48 xl:flex"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
        >
            <Link
                href="/about#team"
                aria-label="View the Kinetiq team"
                className="group flex items-center rounded-full border border-ink-soft/60 bg-ink py-1.5 pl-1.5 pr-1.5 shadow-[0_8px_24px_-16px_rgba(17,17,19,0.5)] backdrop-blur-md transition-colors duration-300 ease-out hover:border-white/40"
            >
                {/* text bar — collapsed to zero width until hover */}
                <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-500 ease-out group-hover:grid-cols-[1fr]">
                    <span className="overflow-hidden">
                        <span className="flex items-center gap-1 whitespace-nowrap pl-3 pr-2 font-heading text-xs font-semibold text-white">
                            View team
                            <span aria-hidden="true" className="transition-transform duration-300 ease-out group-hover:translate-x-0.5">
                                →
                            </span>
                        </span>
                    </span>
                </span>

                {/* avatar stack — stays pinned to the margin, drifts left a touch on hover */}
                <span className="flex -space-x-3 transition-transform duration-500 ease-out group-hover:-translate-x-1">
                    {team.map((member, i) => (
                        <span
                            key={member.name}
                            className="size-11 overflow-hidden rounded-full border-2 border-ink bg-ink-soft shadow-sm ring-1 ring-white/15 transition-transform duration-500 ease-out"
                            style={{
                                transitionDelay: `${i * 40}ms`,
                                zIndex: team.length - i,
                            }}
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                                loading="lazy"
                                className="size-full object-cover object-top"
                            />
                        </span>
                    ))}
                </span>
            </Link>
        </motion.div>
    );
}

export default function Hero() {
    return (
        <section className="relative overflow-hidden">
            {/* relative + the peek's right-0 anchors it to container-wide's own
                right edge (its padding-box), i.e. the same gutter line every
                other right-aligned element on the site respects — not the raw
                viewport edge, which would drift away from the content on
                ultra-wide screens once container-wide hits its max-width. */}
            <div className="container-wide relative pb-20 pt-32 md:pt-40">
                <HeroTeamPeek />
                {/* eyebrow — the three disciplines, immediately visible */}
                <motion.p
                    className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    AI Automation · Web Development · Generative AI
                </motion.p>

                {/* massive wordmark — deliberately NOT animated: this is the LCP
                    element, it must paint immediately; everything around it moves */}
                <h1 className="mt-6 font-heading text-[clamp(4.5rem,15vw,13rem)] font-bold leading-[0.95] tracking-tight">
                    kinet<span className="text-muted/70">iq</span>
                    <HeroDots />
                </h1>

                <div className="mt-8 max-w-xl">
                    <motion.p
                        className="font-heading text-xl font-semibold text-ink md:text-2xl"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        {TAGLINE}
                    </motion.p>
                    <motion.p
                        className="mt-4 text-lg leading-relaxed text-muted"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.42 }}
                    >
                        {SUBHEAD}
                    </motion.p>

                    <motion.div
                        className="mt-8 flex flex-wrap items-center gap-4"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.55 }}
                    >
                        <Link
                            href="/work"
                            className="rounded-none bg-ink px-7 py-3.5 font-heading text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink-soft hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.45)]"
                        >
                            See our work
                        </Link>
                        <Link
                            href="/contact"
                            className="rounded-none border border-line bg-white px-7 py-3.5 font-heading text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-ink"
                        >
                            Start a project
                        </Link>
                    </motion.div>
                </div>

                {/* core areas — interactive, straight from the hero */}
                <motion.div
                    className="mt-16 grid gap-4 md:grid-cols-3"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.12, delayChildren: 0.65 } },
                    }}
                >
                    {services.map((service, i) => (
                        <motion.div
                            key={service.id}
                            variants={{
                                hidden: { opacity: 0, y: 24 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                                },
                            }}
                        >
                            <Link
                                href={`/services#${service.anchor}`}
                                className="card-hover group flex h-full flex-col rounded-2xl border border-line bg-white p-6"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-heading text-sm font-semibold text-muted transition-colors group-hover:text-ink">
                                        0{i + 1}
                                    </span>
                                    <span
                                        aria-hidden="true"
                                        className="font-heading text-lg text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink"
                                    >
                                        →
                                    </span>
                                </div>
                                <h2 className="mt-4 font-heading text-lg font-semibold">
                                    {service.title}
                                </h2>
                                <p className="mt-1 font-heading text-sm text-muted">
                                    {service.tagline}
                                </p>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* values strip */}
                <motion.div
                    className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 1.1 }}
                >
                    <span className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        What we stand for
                    </span>
                    {VALUE_CHIPS.map((value) => (
                        <Link
                            key={value}
                            href="/about"
                            className="rounded-none border border-line bg-surface px-4 py-1.5 font-heading text-xs font-medium text-ink-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-white"
                        >
                            {value}
                        </Link>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
