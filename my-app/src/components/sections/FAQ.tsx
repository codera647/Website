import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import FAQAccordion from "@/components/motion/FAQAccordion";
import { faqItems } from "@/data/faq";

export default function FAQ() {
    return (
        <section className="mx-auto max-w-4xl px-6 py-24 md:py-32">
            <FadeInWhenVisible>
                <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                    FAQ
                </p>
                <h2 className="mt-4 text-4xl font-bold md:text-5xl">Common questions</h2>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.15}>
                <FAQAccordion items={faqItems} className="mt-14" />
            </FadeInWhenVisible>
        </section>
    );
}
