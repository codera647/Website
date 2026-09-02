import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import ApplicationForm from "@/components/sections/ApplicationForm";
import { getAllJobs, getJobBySlug, getJobDocuments, type Job, type JobDocument } from "@/lib/data";
import { roles as fallbackRoles } from "@/data/careers";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    let job = await getJobBySlug(slug).catch(() => null);
    if (!job) {
        const fallback = fallbackRoles.find((r) => r.slug === slug);
        if (fallback) {
            return {
                title: `${fallback.title} | Careers at Kinetiq`,
                description: fallback.summary,
            };
        }
        return {};
    }

    return {
        title: `${job.title} | Careers at Kinetiq`,
        description: job.summary,
    };
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function RolePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    let role: Job | null = null;
    let documents: JobDocument[] = [];
    let otherRoles: (Job | (typeof fallbackRoles)[0])[] = [];

    try {
        role = await getJobBySlug(slug);
        if (role) {
            documents = await getJobDocuments(role.id);
            const all = await getAllJobs(true);
            otherRoles = all.filter((r) => r.slug !== slug);
        }
    } catch {
        // Fallback
    }

    if (!role) {
        const fallback = fallbackRoles.find((r) => r.slug === slug);
        if (!fallback) notFound();
        role = {
            id: 0,
            slug: fallback.slug,
            title: fallback.title,
            department: fallback.department,
            location: fallback.location,
            type: fallback.type as Job["type"],
            summary: fallback.summary,
            jd_content: "",
            responsibilities: fallback.responsibilities,
            requirements: fallback.requirements,
            nice_to_have: fallback.niceToHave || [],
            active: true,
            posted_date: fallback.postedDate,
            created_at: "",
            updated_at: "",
        };
        otherRoles = fallbackRoles.filter((r) => r.slug !== slug);
    }

    const jobPostingSchema = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: role.title,
        description: `${role.summary} ${role.jd_content || ""}`,
        datePosted: role.posted_date || "2024-01-01",
        employmentType: role.type === "Contract" ? "CONTRACTOR" : role.type === "Internship" ? "INTERN" : "FULL_TIME",
        hiringOrganization: {
            "@type": "Organization",
            name: "Kinetiq",
            sameAs: "https://thekinetiq.solutions",
            logo: "https://thekinetiq.solutions/icon.png",
        },
        jobLocationType: "TELECOMMUTE",
        applicantLocationRequirements: {
            "@type": "Country",
            name: "Worldwide",
        },
        responsibilities: role.responsibilities.join("; "),
        skills: role.requirements.join("; "),
    };

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
            />
            {/* Header */}
            <section className="mx-auto max-w-4xl px-6 pb-12 pt-36 md:pt-44">
                <FadeInWhenVisible>
                    <Link
                        href="/careers"
                        className="inline-flex items-center gap-1.5 font-heading text-sm text-muted transition-colors hover:text-ink"
                    >
                        ← All open roles
                    </Link>
                    <p className="mt-8 font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        {role.department} · {role.location} · {role.type}
                    </p>
                    <h1 className="mt-4 max-w-2xl font-heading text-5xl font-bold tracking-tight text-ink md:text-6xl">
                        {role.title}
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
                        {role.summary}
                    </p>
                    {role.posted_date && (
                        <p className="mt-4 font-heading text-xs text-muted/70">
                            Posted {role.posted_date}
                        </p>
                    )}
                </FadeInWhenVisible>
            </section>

            {/* Details & Job Description */}
            <section className="mx-auto max-w-4xl space-y-14 px-6 py-14 md:py-20">
                {role.jd_content && (
                    <FadeInWhenVisible>
                        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                            <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                                About the role
                            </p>
                            <div className="max-w-2xl space-y-4 text-base leading-relaxed text-ink-soft whitespace-pre-line">
                                {role.jd_content}
                            </div>
                        </div>
                    </FadeInWhenVisible>
                )}

                {role.responsibilities && role.responsibilities.length > 0 && (
                    <FadeInWhenVisible>
                        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                            <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                                What you&apos;ll do
                            </p>
                            <ul className="max-w-2xl space-y-3">
                                {role.responsibilities.map((r) => (
                                    <li key={r} className="flex gap-3 text-base leading-relaxed text-ink-soft md:text-lg">
                                        <span aria-hidden="true" className="text-muted">·</span>
                                        <span>{r}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </FadeInWhenVisible>
                )}

                {role.requirements && role.requirements.length > 0 && (
                    <FadeInWhenVisible>
                        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                            <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                                What we&apos;re looking for
                            </p>
                            <ul className="max-w-2xl space-y-3">
                                {role.requirements.map((r) => (
                                    <li key={r} className="flex gap-3 text-base leading-relaxed text-ink-soft md:text-lg">
                                        <span aria-hidden="true" className="text-muted">·</span>
                                        <span>{r}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </FadeInWhenVisible>
                )}

                {role.nice_to_have && role.nice_to_have.length > 0 && (
                    <FadeInWhenVisible>
                        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                            <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                                Nice to have
                            </p>
                            <ul className="max-w-2xl space-y-3">
                                {role.nice_to_have.map((r) => (
                                    <li key={r} className="flex gap-3 text-base leading-relaxed text-ink-soft md:text-lg">
                                        <span aria-hidden="true" className="text-muted">·</span>
                                        <span>{r}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </FadeInWhenVisible>
                )}

                {/* Attached Specification Documents */}
                {documents.length > 0 && (
                    <FadeInWhenVisible>
                        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                            <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                                Role Documents
                            </p>
                            <div className="max-w-2xl space-y-3">
                                <p className="text-sm text-muted">
                                    Official job specification and supplementary documents for this opening:
                                </p>
                                <div className="flex flex-col gap-2 pt-1">
                                    {documents.map((doc) => (
                                        <a
                                            key={doc.id}
                                            href={`/api/documents/${doc.r2_key}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center justify-between rounded-xl border border-line bg-surface p-4 transition-all hover:border-ink hover:bg-[#7a7a7c] shadow-sm"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="flex size-9 shrink-0 items-center justify-center rounded-none bg-ink text-white text-xs font-bold font-heading">
                                                    PDF
                                                </span>
                                                <div>
                                                    <p className="font-heading text-sm font-bold text-ink group-hover:underline">
                                                        {doc.filename}
                                                    </p>
                                                    <p className="text-xs text-muted">
                                                        Specification Document · {formatBytes(doc.size_bytes)}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="font-heading text-xs font-semibold text-ink group-hover:translate-x-1 transition-transform">
                                                Download ↗
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FadeInWhenVisible>
                )}
            </section>

            {/* Apply Form */}
            <section className="bg-ink">
                <div className="mx-auto max-w-4xl px-6 py-20 md:py-24">
                    <FadeInWhenVisible>
                        <div className="text-center">
                            <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-white/45">
                                Apply
                            </p>
                            <h2 className="mt-4 font-heading text-3xl font-bold text-white md:text-4xl">
                                Ready to apply for {role.title}?
                            </h2>
                            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/60">
                                Send your CV and a short note on why you&apos;re a fit.
                                A real person reads every application.
                            </p>
                        </div>
                        <div className="mt-10">
                            <ApplicationForm roleTitle={role.title} />
                        </div>
                    </FadeInWhenVisible>
                </div>
            </section>

            {/* Other Roles */}
            {otherRoles.length > 0 && (
                <section className="border-t border-line bg-surface/30">
                    <FadeInWhenVisible>
                        <Link href={`/careers/${otherRoles[0].slug}`} className="group block">
                            <div className="mx-auto flex max-w-4xl items-center justify-between gap-6 px-6 py-16 md:py-20">
                                <div>
                                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                                        Other active openings
                                    </p>
                                    <p className="mt-3 font-heading text-3xl font-bold text-ink transition-colors group-hover:text-ink-soft md:text-4xl">
                                        {otherRoles[0].title}
                                    </p>
                                    <p className="mt-1 text-sm text-muted">
                                        {otherRoles[0].department} · {otherRoles[0].location}
                                    </p>
                                </div>
                                <span className="font-heading text-3xl text-ink transition-transform group-hover:translate-x-2">
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
