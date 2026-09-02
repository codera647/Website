import Link from "next/link";

/**
 * Custom 404 page — branded "not found" experience that matches the
 * site's visual language instead of the default Next.js 404.
 */
export default function NotFound() {
    return (
        <main className="flex min-h-[70vh] items-center justify-center">
            <div className="container-wide py-32 text-center">
                <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                    404
                </p>
                <h1 className="mt-4 font-heading text-6xl font-bold md:text-8xl">
                    Page not found.
                </h1>
                <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-muted">
                    The page you&apos;re looking for doesn&apos;t exist, was moved, or
                    never existed in the first place.
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="rounded-none bg-ink px-7 py-3.5 font-heading text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink-soft hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.45)]"
                    >
                        Back to home
                    </Link>
                    <Link
                        href="/work"
                        className="rounded-none border border-line bg-[#7a7a7c] px-7 py-3.5 font-heading text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-ink"
                    >
                        Explore our work
                    </Link>
                </div>
            </div>
        </main>
    );
}

