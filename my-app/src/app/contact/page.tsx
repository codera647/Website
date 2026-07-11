import type { Metadata } from "next";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import ContactForm from "@/components/sections/ContactForm";

export const metadata: Metadata = {
    title: "Contact — Kinetiq",
    description: "Tell us about the system you have in mind — we reply within one business day.",
};

/** TODO(user): confirm the public contact email + add real social links. */
const CONTACT_EMAIL = "nex.gen.3023@gmail.com";
const CALENDLY_URL = "https://calendly.com/nex-gen-3023/meeting";

export default function ContactPage() {
    return (
        <main>
            <section className="mx-auto max-w-6xl px-6 pb-24 pt-36 md:pb-32 md:pt-44">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        Contact
                    </p>
                    <h1 className="mt-4 max-w-2xl text-5xl font-bold md:text-6xl">
                        Let&apos;s talk.
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                        Tell us what you&apos;re building — or what&apos;s slowing you down.
                        We reply within one business day.
                    </p>
                </FadeInWhenVisible>

                <div className="mt-16 grid gap-16 lg:grid-cols-[1.4fr_1fr]">
                    <FadeInWhenVisible delay={0.1}>
                        <ContactForm />
                    </FadeInWhenVisible>

                    <FadeInWhenVisible delay={0.2}>
                        <div className="space-y-10">
                            <div>
                                <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                                    Email
                                </p>
                                <a
                                    href={`mailto:${CONTACT_EMAIL}`}
                                    className="mt-3 block font-heading text-lg font-semibold underline-offset-4 hover:underline"
                                >
                                    {CONTACT_EMAIL}
                                </a>
                            </div>
                            <div>
                                <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                                    Prefer to talk?
                                </p>
                                <a
                                    href={CALENDLY_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 inline-block rounded-full border border-line px-6 py-3 font-heading text-sm font-semibold transition-colors hover:border-ink"
                                >
                                    Book a 30-minute call →
                                </a>
                            </div>
                            <div>
                                <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                                    Elsewhere
                                </p>
                                {/* TODO(user): real social links */}
                                <div className="mt-3 flex gap-5 font-heading text-sm font-medium text-muted">
                                    <span>LinkedIn [TODO]</span>
                                    <span>GitHub [TODO]</span>
                                </div>
                            </div>
                        </div>
                    </FadeInWhenVisible>
                </div>
            </section>
        </main>
    );
}
