import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import BracketButton from "@/components/motion/BracketButton";

/** Strong closing CTA (brief §4 Home #8) — inverted monochrome section. */
export default function ClosingCTA() {
    return (
        <section className="bg-ink text-background">
            <div className="container-wide py-20 text-center md:py-24">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-background/75">
                        Ready when you are
                    </p>
                    <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-bold leading-tight md:text-6xl">
                        Put your next step in motion.
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-background/80">
                        More repeat bookings, less manual follow-up, or a custom platform.
                        Tell us where you want to go. We&apos;ll help scope the right system.
                    </p>
                    <BracketButton calLink="kinetiq-solutions/30min" className="mt-10">
                        Book a discovery call
                    </BracketButton>
                </FadeInWhenVisible>
            </div>
        </section>
    );
}
