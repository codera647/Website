import Link from "next/link";
import type { Role } from "@/data/careers";

/**
 * Same interaction language as the work/project cards: static by
 * default, hover (md+) inverts to dark and expands to reveal detail;
 * on mobile it's tap-through only (no hover-expand) via the same
 * `md:group-hover:*` detach pattern used by WorkCard, so siblings
 * never resize together.
 */
export function RoleCard({ role }: { role: Role }) {
    return (
        <Link href={`/careers/${role.slug}`} className="group relative block h-full">
            <div className="relative z-10 flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white p-7 pb-16 transition-colors duration-500 ease-out md:p-8 md:pb-16 md:group-hover:absolute md:group-hover:inset-x-0 md:group-hover:top-0 md:group-hover:z-20 md:group-hover:h-auto md:group-hover:border-ink md:group-hover:bg-ink md:group-hover:shadow-[0_32px_64px_-24px_rgba(17,17,19,0.45)]">
                <div>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.18em] text-muted transition-colors duration-500 ease-out md:group-hover:text-white/50">
                        {role.department} · {role.location} · {role.type}
                    </p>
                    <h3 className="mt-3 font-heading text-2xl font-semibold text-ink transition-colors duration-500 ease-out md:group-hover:text-white">
                        {role.title}
                    </h3>
                </div>

                <span className="absolute bottom-7 right-7 flex size-9 items-center justify-center rounded-full border border-line font-heading text-sm text-muted md:group-hover:hidden">
                    →
                </span>

                <div className="hidden md:grid md:grid-rows-[0fr] md:transition-[grid-template-rows] md:duration-500 md:ease-out md:group-hover:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                        <p className="mt-5 text-sm leading-relaxed text-white/70">
                            {role.summary}
                        </p>
                        <ul className="mt-4 space-y-1.5">
                            {role.responsibilities.slice(0, 2).map((r) => (
                                <li key={r} className="flex gap-2 text-sm text-white/60">
                                    <span aria-hidden="true">·</span>
                                    <span>{r}</span>
                                </li>
                            ))}
                        </ul>
                        <span className="mt-6 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-white">
                            View role &amp; apply
                            <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5">
                                →
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
