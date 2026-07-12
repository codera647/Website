import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import ApplicationForm from "@/components/sections/ApplicationForm";
import { roles } from "@/data/careers";

export function generateStaticParams() {
    return roles.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const role = roles.find((r) => r.slug === slug);
    if (!role) return {};
    return {
        title: `${role.title} — Careers at Kinetiq`,
        description: role.summary,
    };
}

export default async function RolePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const role = roles.find((r) => r.slug === slug);
    if (!role) notFound();

    const otherRoles = roles.filter((r) => r.slug !== slug);

    return (
        <main>
            {/* header */}
            <section className="mx-auto max-w-4xl px-6 pb-12 pt-36 md:pt-44">
                <FadeInWhenVisible>
                    <Link
                        href="/careers"
                        className="font-heading text-sm text-muted hover:text-ink"
                    >
                        ← All roles
                    </Link>
                    <p className="mt-8 font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        {role.department} · {role.location} · {role.type}
                    </p>
                    <h1 className="mt-4 max-w-2xl text-5xl font-bold md:text-6xl">
                        {role.title}
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
                        {role.summary}
                    </p>
                    <p className="mt-4 font-heading text-xs text-muted/70">
                        Posted {role.postedDate}
                    </p>
                </FadeInWhenVisible>
            </section>

            {/* details */}
            <section className="mx-auto max-w-4xl space-y-14 px-6 py-14 md:py-20">
                <FadeInWhenVisible>
                    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                        <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                            What you&apos;ll do
                        </p>
                        <ul className="max-w-2xl space-y-3">
                            {role.responsibilities.map((r) => (
                                <li key={r} className="flex gap-3 text-lg leading-relaxed text-ink-soft">
                                    <span aria-hidden="true" className="text-muted">·</span>
                                    <span>{r}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </FadeInWhenVisible>

                <FadeInWhenVisible>
                    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                        <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                            What we&apos;re looking for
                        </p>
                        <ul className="max-w-2xl space-y-3">
                            {role.requirements.map((r) => (
                                <li key={r} className="flex gap-3 text-lg leading-relaxed text-ink-soft">
                                    <span aria-hidden="true" className="text-muted">·</span>
                                    <span>{r}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </FadeInWhenVisible>

                {role.niceToHave && role.niceToHave.length > 0 && (
                    <FadeInWhenVisible>
                        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                            <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                                Nice to have
                            </p>
                            <ul className="max-w-2xl space-y-3">
                                {role.niceToHave.map((r) => (
                                    <li key={r} className="flex gap-3 text-lg leading-relaxed text-ink-soft">
                                        <span aria-hidden="true" className="text-muted">·</span>
                                        <span>{r}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </FadeInWhenVisible>
                )}
            </section>

            {/* apply */}
            <section className="bg-ink">
                <div className="mx-auto max-w-4xl px-6 py-20 md:py-24">
                    <FadeInWhenVisible>
                        <div className="text-center">
                            <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-white/45">
                                Apply
                            </p>
                            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
                                Ready to apply for {role.title}?
                            </h2>
                            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/60">
                                Send your CV and a short note on why you&apos;re a fit —
                                a real person reads every application.
                            </p>
                        </div>
                        <div className="mt-10">
                            <ApplicationForm roleTitle={role.title} />
                        </div>
                    </FadeInWhenVisible>
                </div>
            </section>

            {/* other roles */}
            {otherRoles.length > 0 && (
                <section className="border-t border-line">
                    <FadeInWhenVisible>
                        <Link href={`/careers/${otherRoles[0].slug}`} className="group block">
                            <div className="mx-auto flex max-w-4xl items-center justify-between gap-6 px-6 py-16 md:py-20">
                                <div>
                                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                                        Other roles
                                    </p>
                                    <p className="mt-3 font-heading text-3xl font-bold md:text-4xl">
                                        {otherRoles[0].title}
                                    </p>
                                </div>
                                <span className="font-heading text-3xl transition-transform group-hover:translate-x-2">
                                    →
                                </span>
                            </div>
                        </Link>
                    </FadeInWhenVisible>
                </section>
            )}
        </main>
    );
}
