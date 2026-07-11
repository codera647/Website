import Link from "next/link";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";

/** Strong closing CTA (brief §4 Home #8) — inverted monochrome section. */
export default function ClosingCTA() {
    return (
        <section className="bg-ink text-white">
            <div className="mx-auto max-w-6xl px-6 py-28 text-center md:py-36">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-white/50">
                        Ready when you are
                    </p>
                    <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-bold leading-tight md:text-6xl">
                        Have a system worth building?
                    </h2>
                    <p className="mx-auto mt-6 max-w-md text-lg text-white/60">
                        A process to automate, a platform to ship, or an idea to prototype —
                        let&apos;s talk it through.
                    </p>
                    <Link
                        href="/contact"
                        className="mt-10 inline-block rounded-full bg-white px-8 py-4 font-heading text-sm font-semibold text-ink transition-colors hover:bg-white/85"
                    >
                        Let&apos;s talk
                    </Link>
                </FadeInWhenVisible>
            </div>
        </section>
    );
}
