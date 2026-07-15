import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import BracketButton from "@/components/motion/BracketButton";

/** Strong closing CTA (brief §4 Home #8) — inverted monochrome section. */
export default function ClosingCTA() {
    return (
        <section className="bg-ink text-white">
            <div className="container-wide py-28 text-center md:py-36">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-white/50">
                        Ready when you are
                    </p>
                    <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-bold leading-tight md:text-6xl">
                        Have a system worth building?
                    </h2>
                    <p className="mx-auto mt-6 max-w-md text-lg text-white/60">
                        A process to automate, a platform to ship, or an idea to
                        prototype. Let&apos;s talk it through.
                    </p>
                    <BracketButton href="/contact" className="mt-10">
                        Let&apos;s talk
                    </BracketButton>
                </FadeInWhenVisible>
            </div>
        </section>
    );
}
