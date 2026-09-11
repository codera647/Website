import Link from "next/link";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";

const pillars = [
    { title: "A place customers return to", description: "Give customers access to their service history and upcoming appointments. Customer portals are included with Momentum and Momentum Pro.", label: "Customer access" },
    { title: "Follow-up that gets done", description: "Confirm bookings and request reviews automatically. Add reminders, seasonal nudges, and win-back messages as your system grows.", label: "Automated engagement" },
    { title: "Visibility where you work", description: "Help nearby customers find the right service with useful local pages, built around the towns and territories you actually serve.", label: "Local search" },
];

export default function ExpertiseGrid() {
    return (
        <section className="bg-ink text-background">
            <div className="container-wide py-16 md:py-24">
                <FadeInWhenVisible>
                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
                        <div>
                            <p className="eyebrow text-background/75">Momentum Systems</p>
                            <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight md:text-5xl">One connected system.<br />Built around your business.</h2>
                        </div>
                        <p className="max-w-xl self-end text-lg leading-relaxed text-background/80">For trades, wellness studios, and other appointment-driven businesses. Start with the essentials, then connect customer access, follow-up, and local visibility as you grow.</p>
                    </div>
                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        {pillars.map((pillar, i) => (
                            <div key={pillar.title} className="border-t border-background/25 pt-6">
                                <p className="font-heading text-sm text-background/70">0{i + 1} / {pillar.label}</p>
                                <h3 className="mt-5 text-2xl font-semibold">{pillar.title}</h3>
                                <p className="mt-4 text-base leading-relaxed text-background/80">{pillar.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-background/20 pt-8">
                        <Link href="/momentum-systems" className="button-primary">Explore Momentum Systems <span aria-hidden="true">→</span></Link>
                        <Link href="/pricing#ai-add-ons" className="inline-flex min-h-11 items-center font-heading text-base font-medium underline-offset-4 hover:underline">Already have a website? Explore AI add-ons →</Link>
                        <Link href="/services" className="inline-flex min-h-11 items-center text-base text-background/80 underline-offset-4 hover:underline">Our engineering capabilities →</Link>
                    </div>
                </FadeInWhenVisible>
            </div>
        </section>
    );
}
