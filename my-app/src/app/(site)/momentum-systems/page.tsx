import type { Metadata } from "next";
import Link from "next/link";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import BracketButton from "@/components/motion/BracketButton";
import FAQAccordion, { type FAQItem } from "@/components/motion/FAQAccordion";

export const metadata: Metadata = {
    title: "Momentum Systems | Kinetiq — Growth Systems for Local Businesses",
    description:
        "Stop paying for a website that sits there. Momentum Systems combines a customer portal, automated follow-up, and location-based SEO into one system that brings customers back — built by Kinetiq.",
    openGraph: {
        title: "Momentum Systems | Kinetiq",
        description:
            "A growth system combining customer identity, automated email/SMS engagement, and programmatic SEO into one outcome-priced engine.",
        url: "https://thekinetiq.solutions/momentum-systems",
        siteName: "Kinetiq",
        type: "website",
    },
};

const PILLARS = [
    {
        number: "01",
        name: "Identity & Access",
        tagline: "A real account system, not just pages.",
        what: "Logins, customer and member portals, and role-based access (customer, staff, admin) built directly into your web presence — using the same authentication and data architecture behind enterprise software.",
        why: "It turns your website from an informational brochure into a destination people return to. Booking history, membership status, equipment records, and recurring appointments live securely behind a login. A returning visitor becomes a recognized, retained customer.",
        practice:
            "An HVAC customer logs in to check past service dates, view furnace model records, and schedule seasonal maintenance in one click instead of calling during busy hours.",
    },
    {
        number: "02",
        name: "Automated Engagement",
        tagline: "Email & SMS sequences that run without a human.",
        what: "Event-triggered and scheduled communications — instant booking confirmations, SMS appointment reminders, automated review requests, win-back campaigns, and seasonal maintenance nudges.",
        why: "This is your retention engine. Most service businesses lose customers not from poor workmanship, but from silence. Automated follow-up replaces the manual outreach a busy business owner never has time to do consistently.",
        practice:
            "Six months after a new AC installation, a customer automatically receives a 'Time for your fall furnace tune-up' text with a pre-filled booking link. Zero staff time required.",
    },
    {
        number: "03",
        name: "Programmatic Growth",
        tagline: "Search-optimized pages generated at scale.",
        what: "Structured, high-intent landing pages engineered systematically for every service and location your business serves (e.g. '[Service] in [City/Town]'), rather than a single generic homepage.",
        why: "Local service businesses win or lose customers in organic search. A single website ranks for one or two generic terms; a programmatic page set can rank for dozens of high-value service-and-city combinations simultaneously.",
        practice:
            "A contractor serving eight surrounding towns gets eight dedicated, hyper-targeted pages for 'Emergency AC Repair in [Town]', capturing local search volume across the entire territory.",
    },
];

const COMPARISON = [
    {
        feature: "Core Deliverable",
        oldWay: "A static brochure website (5–10 pages)",
        momentum: "An integrated growth engine (portal + automation + SEO)",
    },
    {
        feature: "Pricing Model",
        oldWay: "High one-time fee ($5,000–$15,000 upfront)",
        momentum: "Lower build fee + predictable monthly software fee",
    },
    {
        feature: "Value Basis",
        oldWay: "Priced on page count & designer hours",
        momentum: "Priced on outcomes: bookings, retention, reviews",
    },
    {
        feature: "After Launch",
        oldWay: "Sits static; relationship ends on launch day",
        momentum: "Runs continuously, monitors leads, and scales traffic",
    },
    {
        feature: "Follow-Up & Retention",
        oldWay: "Manual phone calls or zero follow-up",
        momentum: "Automated SMS/email sequences on trigger & calendar",
    },
    {
        feature: "Proof of Success",
        oldWay: "'Look how nice the design looks'",
        momentum: "Verifiable numbers: booking lift, lower no-shows, 5-star reviews",
    },
];

const ICP_ITEMS = [
    {
        title: "Repeat & Appointment-Driven",
        desc: "Businesses where repeat bookings and annual maintenance contracts represent major recurring revenue (HVAC, plumbing, electrical, wellness, specialty clinics, auto services).",
    },
    {
        title: "Multi-Town Service Territory",
        desc: "Companies competing across multiple towns, suburbs, or service territories that need localized organic visibility to capture nearby customers.",
    },
    {
        title: "Owner-Operated Decision Maker",
        desc: "Businesses led by owners who directly feel the pain of phone tag, empty booking slots, lost past clients, and tedious manual follow-ups.",
    },
    {
        title: "Digital Opportunity Gap",
        desc: "Established, reputable companies with great offline word-of-mouth but an outdated digital presence that isn't capturing new online demand.",
    },
];

const MOMENTUM_FAQS: FAQItem[] = [
    {
        question: "Do you just build websites?",
        answer:
            "No. A website is only one component of a Momentum System. We combine an authenticated customer portal, automated email/SMS follow-up sequences, and search-optimized programmatic growth pages into a unified engine that produces measurable bookings month after month.",
    },
    {
        question: "How is a Momentum System priced?",
        answer:
            "A Momentum System uses a software-aligned model: a smaller initial build fee covers the architecture, authentication, integrations, and initial page generation, followed by an ongoing monthly fee covering hosting, maintenance, SMS/email workflows, and continuous optimization.",
    },
    {
        question: "How fast can a Momentum System be deployed?",
        answer:
            "A core Momentum System typically launches within 3 to 5 weeks. We engineer the portal and automation workflows in parallel so you start capturing and retaining customers quickly.",
    },
    {
        question: "Can this integrate with our existing CRM or booking software?",
        answer:
            "Yes. We build custom integrations with standard trade and booking platforms (Housecall Pro, ServiceTitan, Jobber, Calendly, Stripe, and custom databases) so your existing operations continue seamlessly.",
    },
    {
        question: "Who builds and maintains our system?",
        answer:
            "The same engineering team at Kinetiq that builds high-scale AI systems, multi-agent pipelines, and production platforms. You get enterprise-grade software engineering tailored for local business growth.",
    },
];

export default function MomentumSystemsPage() {
    return (
        <main>
            {/* 1. Hero Section */}
            <section className="container-wide pb-20 pt-36 md:pb-28 md:pt-44">
                <FadeInWhenVisible>
                    <div className="inline-flex items-center gap-2 rounded-none border border-line bg-surface px-3.5 py-1.5 font-heading text-xs font-medium uppercase tracking-[0.24em] text-muted">
                        <span className="size-1.5 rounded-full bg-ink" />
                        Momentum Systems · For Growing Service Businesses
                    </div>
                    <h1 className="mt-6 max-w-4xl font-heading text-5xl font-bold tracking-tight text-ink md:text-7xl">
                        Stop paying for a website that sits there.
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
                        We don&apos;t build static brochures. We engineer{" "}
                        <strong className="font-semibold text-ink">Momentum Systems</strong> — the
                        unified combination of a customer portal, automated engagement, and
                        location-based search pages that keeps bringing customers back on its own.
                    </p>

                    <div className="mt-10 flex flex-wrap items-center gap-4">
                        <BracketButton calLink="abdul-moiz/30min">
                            Get your free growth audit
                        </BracketButton>
                        <Link
                            href="#pillars"
                            className="rounded-none border border-line bg-white px-7 py-3.5 font-heading text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-ink"
                        >
                            See how it works →
                        </Link>
                    </div>
                </FadeInWhenVisible>
            </section>

            {/* 2. The Three Pillars Section */}
            <section id="pillars" className="scroll-mt-24 border-t border-line bg-surface/50 py-24 md:py-32">
                <div className="container-wide">
                    <FadeInWhenVisible>
                        <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                            The Three Pillars
                        </p>
                        <h2 className="mt-4 max-w-2xl text-4xl font-bold md:text-5xl text-ink">
                            One unified system. Three engines of growth.
                        </h2>
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
                            None of these components is a standalone gimmick. When combined into a single architecture, they turn traffic into retained, high-value accounts.
                        </p>
                    </FadeInWhenVisible>

                    <div className="mt-16 space-y-12">
                        {PILLARS.map((p, i) => (
                            <FadeInWhenVisible key={p.number} delay={i * 0.1}>
                                <div className="grid gap-8 rounded-2xl border border-line bg-white p-8 md:p-12 lg:grid-cols-12 lg:gap-12">
                                    <div className="lg:col-span-5 flex flex-col justify-between">
                                        <div>
                                            <span className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                                                Pillar {p.number}
                                            </span>
                                            <h3 className="mt-2 font-heading text-2xl font-bold text-ink md:text-3xl">
                                                {p.name}
                                            </h3>
                                            <p className="mt-2 font-heading text-sm font-medium text-ink-soft">
                                                {p.tagline}
                                            </p>
                                        </div>
                                        <div className="mt-6 rounded-xl border border-line bg-surface p-4 text-xs leading-relaxed text-muted">
                                            <span className="block font-heading font-semibold uppercase tracking-wider text-[11px] text-ink mb-1">
                                                In Practice (e.g. HVAC / Trades):
                                            </span>
                                            {p.practice}
                                        </div>
                                    </div>

                                    <div className="lg:col-span-7 space-y-6 lg:border-l lg:border-line lg:pl-12">
                                        <div>
                                            <h4 className="font-heading text-xs uppercase tracking-wider text-muted font-semibold">
                                                What It Is
                                            </h4>
                                            <p className="mt-2 text-sm leading-relaxed text-ink/90">
                                                {p.what}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-heading text-xs uppercase tracking-wider text-muted font-semibold">
                                                Why It Matters
                                            </h4>
                                            <p className="mt-2 text-sm leading-relaxed text-ink/90">
                                                {p.why}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </FadeInWhenVisible>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. The Compounding Flywheel Section */}
            <section className="border-t border-line bg-white py-24 md:py-32">
                <div className="container-wide">
                    <FadeInWhenVisible>
                        <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                            The Compounding Loop
                        </p>
                        <h2 className="mt-4 max-w-2xl text-4xl font-bold md:text-5xl text-ink">
                            Why the three pillars compound into a flywheel.
                        </h2>
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
                            A single feature is a one-off tool. All three pillars together create a self-reinforcing loop that builds momentum month over month without extra ad spend.
                        </p>
                    </FadeInWhenVisible>

                    <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <FadeInWhenVisible delay={0.05}>
                            <div className="flex h-full flex-col justify-between rounded-xl border border-line bg-surface p-6">
                                <div>
                                    <span className="font-heading text-xs font-bold text-muted">01 / DISCOVERY</span>
                                    <h3 className="mt-3 font-heading text-lg font-bold text-ink">
                                        Programmatic Growth Pages
                                    </h3>
                                    <p className="mt-3 text-xs leading-relaxed text-muted">
                                        Rank for dozens of service-and-city search queries, capturing local customers who would never find a generic homepage.
                                    </p>
                                </div>
                                <span className="mt-6 font-heading text-xs text-ink-soft">→ Feeds into Accounts</span>
                            </div>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible delay={0.1}>
                            <div className="flex h-full flex-col justify-between rounded-xl border border-line bg-surface p-6">
                                <div>
                                    <span className="font-heading text-xs font-bold text-muted">02 / CONVERSION</span>
                                    <h3 className="mt-3 font-heading text-lg font-bold text-ink">
                                        Identity & Access Portal
                                    </h3>
                                    <p className="mt-3 text-xs leading-relaxed text-muted">
                                        Converts anonymous visitors into registered accounts with service records, warranties, and saved preferences.
                                    </p>
                                </div>
                                <span className="mt-6 font-heading text-xs text-ink-soft">→ Triggers Automation</span>
                            </div>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible delay={0.15}>
                            <div className="flex h-full flex-col justify-between rounded-xl border border-line bg-surface p-6">
                                <div>
                                    <span className="font-heading text-xs font-bold text-muted">03 / RETENTION</span>
                                    <h3 className="mt-3 font-heading text-lg font-bold text-ink">
                                        Automated Follow-Up
                                    </h3>
                                    <p className="mt-3 text-xs leading-relaxed text-muted">
                                        Runs automated seasonal reminders, win-backs, and SMS nudges so customers return on schedule without staff effort.
                                    </p>
                                </div>
                                <span className="mt-6 font-heading text-xs text-ink-soft">→ Prompts Reviews</span>
                            </div>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible delay={0.2}>
                            <div className="flex h-full flex-col justify-between rounded-xl border border-line bg-surface p-6">
                                <div>
                                    <span className="font-heading text-xs font-bold text-muted">04 / REPUTATION</span>
                                    <h3 className="mt-3 font-heading text-lg font-bold text-ink">
                                        Review Velocity & Rank
                                    </h3>
                                    <p className="mt-3 text-xs leading-relaxed text-muted">
                                        Happy customers are prompted to leave 5-star Google reviews, strengthening local authority and driving even more organic traffic.
                                    </p>
                                </div>
                                <span className="mt-6 font-heading text-xs text-ink-soft">⟳ Loops back to Growth</span>
                            </div>
                        </FadeInWhenVisible>
                    </div>
                </div>
            </section>

            {/* 4. The Business Model Shift (Comparison Table) */}
            <section className="border-t border-line bg-surface/50 py-24 md:py-32">
                <div className="container-wide">
                    <FadeInWhenVisible>
                        <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                            The Business Model Shift
                        </p>
                        <h2 className="mt-4 max-w-2xl text-4xl font-bold md:text-5xl text-ink">
                            Priced on outcomes, not page counts.
                        </h2>
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
                            Traditional web agencies charge an arbitrary lump sum and disappear. We align with your growth via a predictable software model.
                        </p>
                    </FadeInWhenVisible>

                    <div className="mt-14 overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-line bg-surface text-xs font-heading uppercase tracking-wider text-muted">
                                    <th className="p-5 font-semibold">Dimension</th>
                                    <th className="p-5 font-semibold text-muted/80">Traditional Agency Website</th>
                                    <th className="p-5 font-semibold text-ink bg-ink/5">Momentum System</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line">
                                {COMPARISON.map((row, i) => (
                                    <tr key={i} className="hover:bg-surface/50 transition-colors">
                                        <td className="p-5 font-heading font-medium text-ink">
                                            {row.feature}
                                        </td>
                                        <td className="p-5 text-muted">
                                            {row.oldWay}
                                        </td>
                                        <td className="p-5 font-medium text-ink bg-ink/5">
                                            {row.momentum}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* 5. Who This Is For */}
            <section className="border-t border-line bg-white py-24 md:py-32">
                <div className="container-wide">
                    <FadeInWhenVisible>
                        <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                            Ideal Client Profile
                        </p>
                        <h2 className="mt-4 max-w-2xl text-4xl font-bold md:text-5xl text-ink">
                            Built specifically for repeat service businesses.
                        </h2>
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
                            Momentum Systems deliver the highest ROI for established companies where retention, scheduled appointments, and local territory search drive profit.
                        </p>
                    </FadeInWhenVisible>

                    <div className="mt-14 grid gap-6 md:grid-cols-2">
                        {ICP_ITEMS.map((item, i) => (
                            <FadeInWhenVisible key={i} delay={i * 0.08}>
                                <div className="h-full rounded-2xl border border-line bg-surface p-8">
                                    <h3 className="font-heading text-xl font-bold text-ink">
                                        {item.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-relaxed text-muted">
                                        {item.desc}
                                    </p>
                                </div>
                            </FadeInWhenVisible>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Momentum FAQ Section */}
            <section className="border-t border-line bg-surface/50 py-24 md:py-32">
                <div className="container-wide max-w-4xl">
                    <FadeInWhenVisible>
                        <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                            Questions & Answers
                        </p>
                        <h2 className="mt-4 text-4xl font-bold md:text-5xl text-ink">
                            Frequently Asked Questions
                        </h2>
                    </FadeInWhenVisible>

                    <div className="mt-12">
                        <FAQAccordion items={MOMENTUM_FAQS} />
                    </div>
                </div>
            </section>

            {/* 7. Closing CTA */}
            <section className="bg-ink text-white">
                <div className="container-wide py-28 text-center md:py-36">
                    <FadeInWhenVisible>
                        <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-white/50">
                            Ready when you are
                        </p>
                        <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-bold leading-tight md:text-6xl">
                            Ready to put your growth in motion?
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
                            Book a free 30-minute growth audit. We will analyze your local search visibility, follow-up gaps, and map out what a custom Momentum System will produce for your business.
                        </p>
                        <div className="mt-10">
                            <BracketButton calLink="abdul-moiz/30min">
                                Book your free growth audit
                            </BracketButton>
                        </div>
                    </FadeInWhenVisible>
                </div>
            </section>
        </main>
    );
}

