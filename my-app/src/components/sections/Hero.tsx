"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import BookCallButton from "@/components/booking/BookCallButton";
import { team } from "@/data/team";

const steps = [
    { title: "Get found", detail: "Useful local pages connect customers to your services." },
    { title: "Make booking easy", detail: "A clear path from the first visit to a confirmed appointment." },
    { title: "Keep the relationship", detail: "Timely reminders, review requests, and reasons to return." },
];

export default function Hero() {
    const reduced = useReducedMotion();
    return (
        <section className="relative overflow-hidden">
            <div className="container-wide pb-16 pt-28 md:pb-20 md:pt-36">
                <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
                    <div>
                        <p className="flex items-baseline font-heading text-3xl font-bold tracking-tight">
                            kinet<span className="text-muted">iq</span>
                            <span aria-hidden="true" className="ml-3 inline-flex gap-1.5">
                                {[0, 1, 2].map((i) => (
                                    <motion.span key={i} className="size-2 rounded-full bg-accent"
                                        animate={reduced ? { opacity: 1, y: 0 } : { y: [0, -4, 0], opacity: [0.45, 1, 0.45] }}
                                        transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.25 }} />
                                ))}
                            </span>
                        </p>
                        <p className="mt-3 font-heading text-sm font-medium text-muted">Always in motion.</p>
                        <h1 className="mt-7 max-w-3xl text-[clamp(2.5rem,4vw,3.75rem)] font-bold leading-[1.06] tracking-[-0.04em] text-balance">
                            More bookings.<br />Stronger relationships.<br /><span className="text-accent">Less busywork.</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                            We connect your website, booking, and follow-up into a Momentum System
                            that helps your service business get found and bring customers back.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <BookCallButton calLink="kinetiq-solutions/30min" className="button-primary">
                                Book a discovery call <span aria-hidden="true">↗</span>
                            </BookCallButton>
                            <Link href="/work" className="button-secondary">Explore our work <span aria-hidden="true">→</span></Link>
                        </div>
                        <Link href="/about#team" className="mt-7 inline-flex min-h-11 items-center gap-3 text-sm text-muted hover:text-ink">
                            <span className="flex shrink-0 -space-x-2">
                                {team.map((member) => (
                                    <Image key={member.name} src={member.image} alt={member.name} width={36} height={36}
                                        className="size-9 rounded-full border-2 border-background object-cover object-top" />
                                ))}
                            </span>
                            Meet the engineers behind your system <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                    <div className="relative border border-line bg-background p-6 shadow-[0_24px_70px_-45px_rgba(19,19,21,0.35)] md:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
                            <p className="font-heading text-sm font-semibold">The Momentum cycle</p>
                            <span className="font-heading text-xs uppercase tracking-[0.16em] text-accent">How it connects</span>
                        </div>
                        <ol className="mt-6 space-y-6">
                            {steps.map((step, i) => (
                                <li key={step.title} className="relative flex gap-4">
                                    {i < steps.length - 1 && <span aria-hidden="true" className="absolute left-[19px] top-11 h-[calc(100%-12px)] w-px bg-line" />}
                                    <span className="flex size-10 shrink-0 items-center justify-center border border-accent/20 bg-accent-soft font-heading text-sm font-semibold text-accent">0{i + 1}</span>
                                    <div className="pb-2">
                                        <h2 className="text-xl font-semibold">{step.title}</h2>
                                        <p className="mt-2 text-base leading-relaxed text-muted">{step.detail}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                        <div className="mt-5 flex items-center gap-3 bg-ink px-5 py-4 text-background">
                            <span aria-hidden="true" className="text-2xl">↻</span>
                            <p className="text-sm leading-relaxed">A return visit starts the next cycle.</p>
                        </div>
                        <p className="mt-4 text-xs leading-relaxed text-muted">Configured around your services, customers, and chosen plan.</p>
                    </div>
                </div>
                <div className="mt-14 grid border-y border-line md:grid-cols-2">
                    <Link href="/momentum-systems" className="group py-7 md:pr-8">
                        <p className="eyebrow">For local &amp; repeat-service businesses</p>
                        <h2 className="mt-3 flex items-center justify-between gap-3 text-2xl font-semibold">Grow your service business <span aria-hidden="true" className="text-accent">↗</span></h2>
                        <p className="mt-2 text-base leading-relaxed text-muted">Explore Momentum Systems and practical AI add-ons.</p>
                    </Link>
                    <Link href="/ai-engagements" className="group border-t border-line py-7 md:border-l md:border-t-0 md:pl-8">
                        <p className="eyebrow">For founders &amp; engineering teams</p>
                        <h2 className="mt-3 flex items-center justify-between gap-3 text-2xl font-semibold">Build custom software or AI <span aria-hidden="true" className="text-accent">↗</span></h2>
                        <p className="mt-2 text-base leading-relaxed text-muted">Scope a workflow, a research tool, or a complete platform.</p>
                    </Link>
                </div>
            </div>
        </section>
    );
}
