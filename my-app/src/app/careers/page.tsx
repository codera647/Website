import type { Metadata } from "next";
import Link from "next/link";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import StaggerList from "@/components/motion/StaggerList";
import { RoleCard } from "@/components/sections/RoleCard";
import { roles } from "@/data/careers";

export const metadata: Metadata = {
    title: "Careers — Kinetiq",
    description: "Open roles at Kinetiq — an AI automation, web development, and generative AI studio.",
};

export default function CareersPage() {
    return (
        <main>
            <section className="mx-auto max-w-6xl px-6 pb-10 pt-36 md:pt-44">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        Careers
                    </p>
                    <h1 className="mt-4 max-w-2xl text-5xl font-bold md:text-6xl">
                        Build what&apos;s next, with us.
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                        We&apos;re a small studio that ships real, production systems —
                        not decks. If that&apos;s the kind of work you want to do, see
                        what&apos;s open below.
                    </p>
                </FadeInWhenVisible>
            </section>

            {roles.length > 0 ? (
                <section className="mx-auto max-w-6xl px-6 pb-24 pt-10 md:pb-32">
                    <StaggerList
                        className="grid gap-6 transition-[padding-bottom] duration-500 ease-out md:grid-cols-2 md:has-[:hover]:pb-64"
                        itemClassName="h-full"
                        stagger={0.1}
                    >
                        {roles.map((role) => (
                            <RoleCard key={role.slug} role={role} />
                        ))}
                    </StaggerList>
                </section>
            ) : (
                <section className="mx-auto max-w-6xl px-6 pb-24 md:pb-32">
                    <FadeInWhenVisible y={24}>
                        <div className="rounded-2xl border border-line bg-surface px-8 py-16 text-center md:py-20">
                            <p className="font-heading text-2xl font-semibold text-ink md:text-3xl">
                                No open roles right now.
                            </p>
                            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                                We&apos;re not actively hiring, but we&apos;re always glad
                                to hear from people doing great work. If that&apos;s you,
                                reach out anyway.
                            </p>
                            <Link
                                href="/contact"
                                className="mt-7 inline-flex items-center gap-1.5 rounded-full bg-ink px-6 py-3 font-heading text-sm font-semibold text-white transition-colors hover:bg-ink-soft"
                            >
                                Get in touch
                                <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </FadeInWhenVisible>
                </section>
            )}
        </main>
    );
}
