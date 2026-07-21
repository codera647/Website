import Link from "next/link";
import type { BlogPost } from "@/data/blog";

function formatMonthYear(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * The site's blog card — dark ink block sitting on the page background,
 * label + title top-left, a circular arrow button pinned bottom-right that
 * grows into a glowing "Read more" button on hover. Used on the /blog grid
 * and reused as-is for the related-articles rail on individual posts.
 */
export default function BlogCard({ post }: { post: BlogPost }) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-2xl bg-ink p-7 transition-transform duration-300 ease-out hover:-translate-y-1 md:min-h-[300px] md:p-8"
        >
            <div>
                <p className="font-heading text-xs font-medium uppercase tracking-[0.22em] text-white/45">
                    {formatMonthYear(post.date)} · {post.category}
                </p>
                <h3 className="mt-4 font-heading text-xl font-semibold leading-snug text-white md:text-2xl">
                    {post.title}
                </h3>
            </div>

            {/* soft glow behind the button, fades in on hover */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-6 right-6 size-32 rounded-full bg-white/25 opacity-0 blur-3xl transition-opacity duration-500 ease-out group-hover:opacity-100"
            />

            {/* circular button — grows and reveals "Read more" on hover */}
            <span
                aria-hidden="true"
                className="relative ml-auto flex size-11 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-all duration-500 ease-out group-hover:size-20 group-hover:border-white"
            >
                <span className="absolute font-heading text-lg transition-opacity duration-300 ease-out group-hover:opacity-0">
                    →
                </span>
                <span className="absolute text-center font-heading text-[0.6rem] font-semibold uppercase leading-tight tracking-wide opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
                    Read
                    <br />
                    more
                </span>
            </span>
        </Link>
    );
}
