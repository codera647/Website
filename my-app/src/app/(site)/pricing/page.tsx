import type { Metadata } from "next";
import Link from "next/link";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import BracketButton from "@/components/motion/BracketButton";
import FAQAccordion, { type FAQItem } from "@/components/motion/FAQAccordion";
import SurveyTriggerButton from "@/components/chat/SurveyTriggerButton";

export const metadata: Metadata = {
    title: "Pricing & Founding Tiers | Momentum Systems by Kinetiq",
    description:
        "Transparent, software-aligned pricing for Momentum Systems. Foundation ($497 setup), Momentum ($797 setup), and Momentum Pro ($1,297 setup) with founding setup discounts for US, UK, and global businesses.",
    keywords: [
        "Momentum Systems Pricing",
        "HVAC Software Pricing",
        "Customer Portal Development Cost",
        "Service Business Automation Pricing",
        "Contractor Programmatic SEO Cost",
        "Founding Client Discount",
    ],
    alternates: {
        canonical: "/pricing",
    },
    openGraph: {
        title: "Pricing & Founding Tiers | Momentum Systems by Kinetiq",
        description:
            "Predictable, outcome-based pricing for service businesses. Founding pricing discounts available for the first 10 clients.",
        url: "https://thekinetiq.solutions/pricing",
        siteName: "Kinetiq",
        type: "website",
    },
};

interface PricingTier {
    id: string;
    name: string;
    badge?: string;
    isPopular?: boolean;
    setupOriginal: string;
    setupFounding: string;
    monthlyOriginal: string;
    monthlyFounding: string;
    tagline: string;
    bestFor: string;
    features: string[];
    ctaText: string;
    /** Momentum Systems tiers only — points down to the AI Add-Ons section. */
    crossLinkToAddons?: boolean;
}

const TIERS: PricingTier[] = [
    {
        id: "foundation",
        bestFor: "Starting out · One service area · No customer login",
        name: "Foundation",
        setupOriginal: "$1,997",
        setupFounding: "$497",
        monthlyOriginal: "$697",
        monthlyFounding: "$497",
        tagline:
            "Get a real foundation in place — the site, Google profile, and the two automations that matter most.",
        features: [
            "Modern, mobile-first website (replacement or new build)",
            "Google Business Profile setup & local optimization",
            "Core automation 01: Instant booking confirmations",
            "Core automation 02: Post-service review requests",
            "Local SEO for 1 primary service territory",
            "Managed hosting and uptime monitoring",
            "Monthly performance report (traffic, leads & reviews)",
        ],
        ctaText: "Discuss Foundation",
        crossLinkToAddons: true,
    },
    {
        id: "momentum",
        bestFor: "Established business · Up to 8 towns · Customer portal",
        name: "Momentum",
        badge: "Recommended · Flagship",
        isPopular: true,
        setupOriginal: "$2,997",
        setupFounding: "$797",
        monthlyOriginal: "$1,297",
        monthlyFounding: "$897",
        tagline:
            "The full Momentum System — a portal, multi-step automation, and search visibility working as one engine.",
        features: [
            "Everything in Foundation, plus:",
            "Customer & Member Portal (logins, service history, maintenance records)",
            "Full Automated Engagement: SMS reminders & win-back sequences",
            "Seasonal maintenance nudges (e.g. automatic fall heating tune-up texts)",
            "Programmatic Local SEO across up to 8 towns/service areas",
            "Dedicated, high-converting service landing pages per town",
            "Monthly 30-min growth strategy call with our engineering lead",
            "Full attribution dashboard (bookings, retention rate, review trend)",
        ],
        ctaText: "Discuss Momentum",
        crossLinkToAddons: true,
    },
    {
        id: "momentum-pro",
        bestFor: "Multiple locations · AI booking · CRM integration",
        name: "Momentum Pro",
        setupOriginal: "$4,997",
        setupFounding: "$1,297",
        monthlyOriginal: "$2,197",
        monthlyFounding: "$1,497",
        tagline:
            "Everything in Momentum, built to scale across multi-location operations and plug directly into your CRM.",
        features: [
            "Everything in Momentum, plus:",
            "Unlimited service-area pages & multi-location support",
            "AI-assisted lead qualification & auto-booking chat assistant",
            "CRM connection, subject to compatible API access and agreed scope",
            "Monthly A/B conversion testing on landing pages & sequences",
            "Advanced real-time analytics & multi-channel attribution",
            "Priority support and monthly optimization",
        ],
        ctaText: "Discuss Momentum Pro",
        crossLinkToAddons: true,
    },
];

const ADDON_TIERS: PricingTier[] = [
    {
        id: "ai-assist",
        bestFor: "One specific task · Choose one automation",
        name: "AI Assist",
        setupOriginal: "$997",
        setupFounding: "$297",
        monthlyOriginal: "$397",
        monthlyFounding: "$297",
        tagline: "Pick one automation to take the manual work out of what happens after a booking.",
        features: [
            "Pick one automation:",
            "AI chat widget for lead capture & booking (answers basic questions, books a call/appointment automatically)",
            "Automated document/invoice data extraction (pulls job details, amounts & dates from paperwork)",
            "One workflow automation (e.g. auto-notify a technician on a new job, auto-update job status)",
        ],
        ctaText: "Discuss this automation",
    },
    {
        id: "ai-operations",
        bestFor: "Two automations · Monitoring and optimization",
        name: "AI Operations",
        badge: "Recommended",
        isPopular: true,
        setupOriginal: "$1,997",
        setupFounding: "$497",
        monthlyOriginal: "$797",
        monthlyFounding: "$597",
        tagline: "Two automations, plus the monitoring to know they're actually working.",
        features: [
            "Any two automations from the AI Assist list",
            "Monthly monitoring & optimization (is the chat widget converting? are automations firing correctly?)",
            "A simple monthly performance report",
        ],
        ctaText: "Discuss this automation",
    },
    {
        id: "ai-suite",
        bestFor: "Voice or advanced chat · Workflows · CRM connection",
        name: "AI Suite",
        setupOriginal: "$3,997",
        setupFounding: "$997",
        monthlyOriginal: "$1,397",
        monthlyFounding: "$1,097",
        tagline: "Full automation coverage across the business, wired into the tools you already use.",
        features: [
            "Everything in AI Operations, plus:",
            "AI voice receptionist or advanced conversational chat agent",
            "Multiple workflow automations across the business (dispatch, scheduling, follow-up)",
            "Field-service/CRM integration, subject to API access and agreed scope",
            "Custom reporting dashboard",
        ],
        ctaText: "Discuss this automation",
    },
];

const PRICING_FAQS: FAQItem[] = [
    {
        question: "Why is there a setup fee if this is priced like software?",
        answer:
            "The setup fee covers the custom engineering work — configuring your website, booking workflows, automation, and local pages for the chosen tier. Foundation has no customer login; a customer portal starts with Momentum. The monthly fee covers running, hosting, monitoring, and continuously improving the system after launch.",
    },
    {
        question: "What happens when the founding pricing ends?",
        answer:
            "Founding pricing is strictly limited to Kinetiq's first 10 Momentum Systems clients total. Once you claim a founding slot, your discounted monthly rate is permanently locked in for as long as you stay a customer — it will never increase.",
    },
    {
        question: "Why month-to-month after 3 months, rather than from day one?",
        answer:
            "The initial 3 months is the realistic runway for the system to ramp: programmatic local pages need time to get indexed and rank on Google, and automated follow-ups need a full service cycle to nurture customers and generate repeat bookings. After the first 90 days, you can cancel or pause anytime with zero penalty.",
    },
    {
        question: "Do I own the website/portal, or is it locked to Kinetiq?",
        answer:
            "Your domain is always registered in your name — either your existing one, or a new one we register for you during setup, but it's yours either way. The website and portal run on our infrastructure while you're a customer, same as any hosted software; your domain is what's portable if you ever move on.",
    },
    {
        question: "Can I switch or upgrade tiers later?",
        answer:
            "Yes. You can upgrade or downgrade between tiers as your service territory expands or your needs change. Tier adjustments take effect seamlessly on your next monthly billing cycle.",
    },
    {
        question: "How do we get started?",
        answer:
            "Click any tier's button to schedule a free 30-minute growth audit. We'll examine your current online footprint, demonstrate what the portal and automations look like for your trade, and map out your launch timeline.",
    },
    {
        question: "Can I get an AI Add-On without a Momentum Systems plan?",
        answer:
            "Yes. AI add-ons work on their own or alongside a Momentum Systems plan. When bundled, the add-on setup fee is discounted by 10–15%; we confirm the exact scope and discount before you commit.",
    },
    {
        question: "Do these use my existing phone number / socials, or something new?",
        answer:
            "The chat widget installs directly on your existing website — no new site or new number needed. If you add the AI voice receptionist, it forwards from the business number you already have, so customers keep calling the number they know; we don't ask you to port or change it. Automations that request reviews or send follow-ups run through your existing accounts and messaging channels wherever possible.",
    },
    {
        question: "What if I'm not sure which automation I need?",
        answer:
            "That's exactly what the initial call is for — we'll look at where you're losing time or missing follow-up and recommend the right one.",
    },
];

/** Reused for both the Momentum Systems tiers and the AI Add-Ons tiers — same card, same price treatment, so Add-Ons read as a continuation of the page rather than a different product. */
function TierCard({ tier, index }: { tier: PricingTier; index: number }) {
    return (
        <FadeInWhenVisible delay={index * 0.1} className="flex">
            <div
                className={`card-hover group flex w-full flex-col justify-between rounded-2xl border bg-background p-8 transition-all md:p-10 ${
                    tier.isPopular ? "relative border-accent shadow-lg ring-1 ring-accent/15" : "border-line"
                }`}
            >
                <div>
                    {/* Top Header & Optional Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-heading text-2xl font-bold text-ink">{tier.name}</h3>
                        {tier.badge && (
                            <span className="rounded-none bg-accent px-2.5 py-1 font-heading text-xs font-bold uppercase tracking-wider text-background">
                                {tier.badge}
                            </span>
                        )}
                    </div>

                    <p className="mt-4 text-base leading-relaxed text-muted">{tier.tagline}</p>
                    <p className="mt-4 border-l-2 border-accent pl-3 text-sm font-medium text-ink">{tier.bestFor}</p>

                    {/* Price Block */}
                    <div className="mt-8 border-y border-line py-6">
                        {/* Monthly Fee */}
                        <div className="flex flex-wrap items-baseline gap-2">
                            <span className="text-sm text-muted line-through">{tier.monthlyOriginal}</span>
                            <span className="font-heading text-4xl font-bold text-ink">{tier.monthlyFounding}</span>
                            <span className="text-xs font-medium text-muted">/ month</span>
                        </div>

                        {/* Setup Fee */}
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                            <span className="text-muted">Setup:</span>
                            <span className="text-muted line-through">{tier.setupOriginal}</span>
                            <span className="font-heading font-bold text-ink">{tier.setupFounding}</span>
                            <span className="text-muted/80">(one-time build fee)</span>
                        </div>
                    </div>

                    {/* Features List */}
                    <ul className="mt-8 space-y-3.5 text-base leading-relaxed text-ink/90">
                        {tier.features.map((feat, fIdx) => (
                            <li
                                key={fIdx}
                                className={`flex items-start gap-2.5 ${
                                    feat.startsWith("Everything in") || feat.startsWith("Pick one")
                                        ? "font-heading font-semibold text-ink border-b border-line pb-2"
                                        : ""
                                }`}
                            >
                                {!feat.startsWith("Everything in") && !feat.startsWith("Pick one") && (
                                    <svg
                                        className="size-4 shrink-0 text-ink mt-0.5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                                <span>{feat}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Action CTA */}
                <div className="mt-10 pt-6 border-t border-line">
                    <BracketButton
                        calLink="kinetiq-solutions/30min"
                        className="w-full text-center"
                        buttonClassName={
                            tier.isPopular
                                ? "bg-accent text-white group-hover:bg-accent-hover"
                                : "bg-surface text-ink group-hover:bg-ink group-hover:text-background"
                        }
                    >
                        {tier.ctaText}
                    </BracketButton>
                    {tier.crossLinkToAddons && (
                        <a
                            href="#ai-add-ons"
                            className="mt-3 block text-center text-xs font-medium text-muted underline-offset-4 hover:text-ink hover:underline"
                        >
                            Want to add AI automation? See AI Add-Ons below.
                        </a>
                    )}
                </div>
            </div>
        </FadeInWhenVisible>
    );
}

export default function PricingPage() {
    const pricingSchemas = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Home",
                        item: "https://thekinetiq.solutions",
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Pricing",
                        item: "https://thekinetiq.solutions/pricing",
                    },
                ],
            },
            {
                "@type": "FAQPage",
                mainEntity: PRICING_FAQS.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: faq.answer,
                    },
                })),
            },
        ],
    };

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchemas) }}
            />
            {/* 1. Hero Section */}
            <section className="container-wide pb-16 pt-36 md:pb-24 md:pt-44">
                <FadeInWhenVisible>
                    <div className="inline-flex items-center gap-2.5 rounded-none border border-line bg-surface px-3.5 py-1.5 font-heading text-xs font-medium uppercase tracking-[0.24em] text-muted shadow-sm">
                        <span className="relative flex size-2">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-ink opacity-75 duration-1000" />
                            <span className="relative inline-flex size-2 rounded-full bg-ink" />
                        </span>
                        Founding Client Pricing · Limited to First 10 Businesses
                    </div>
                    <h1 className="mt-6 max-w-4xl font-heading text-5xl font-bold tracking-tight text-ink md:text-7xl">
                        Choose the system your business needs next.
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
                        A one-time setup fee and predictable monthly care. Choose a growth system for your service business, or add practical AI to the tools you already have. All prices are in USD.
                    </p>
                </FadeInWhenVisible>

                {/* Founding Cohort Notice Card */}
                <FadeInWhenVisible delay={0.1} className="mt-10">
                    <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-none bg-ink text-background font-heading font-bold text-xs">
                                10
                            </span>
                            <div>
                                <p className="font-heading text-sm font-bold text-ink">
                                    First 10 Momentum Systems clients
                                </p>
                                <p className="text-xs text-muted">
                                    One founding cohort across all three tiers. Ask us about availability; founding rates stay locked while you remain a customer.
                                </p>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <span className="inline-block font-heading text-xs font-semibold uppercase tracking-wider text-ink-soft">
                                Month-to-month after 90 days · No long-term lock-in
                            </span>
                        </div>
                    </div>

                    {/* 1-Min Assessment Trigger Banner */}
                    <div className="mt-4 flex flex-col gap-4 rounded-xl border border-line bg-background p-5 sm:flex-row sm:items-center sm:justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-none bg-ink text-background font-heading font-bold text-xs">
                                🎯
                            </span>
                            <div>
                                <p className="font-heading text-xs font-bold text-ink">
                                    Not sure which tier fits your business?
                                </p>
                                <p className="text-[11px] text-muted">
                                    Take our 60-second interactive assessment with Motion to receive a tailored tier recommendation.
                                </p>
                            </div>
                        </div>
                        <SurveyTriggerButton />
                    </div>
                </FadeInWhenVisible>
            </section>

            <section className="container-wide pb-10">
                <div className="flex flex-wrap items-center justify-between gap-4 border-y border-line py-6">
                    <p className="text-base text-muted">Building a custom AI product or an enterprise platform?</p>
                    <Link href="/ai-engagements" className="font-heading text-base font-semibold text-accent underline-offset-4 hover:underline">Explore custom engagements →</Link>
                </div>
            </section>
            {/* 2. Three Pricing Tiers */}
            <section className="border-t border-line bg-surface/40 py-20 md:py-28">
                <div className="container-wide">
                    <h2 className="mb-8 text-3xl font-bold md:text-4xl">Momentum Systems</h2>
                    <div className="grid gap-8 xl:grid-cols-3 xl:items-stretch">
                        {TIERS.map((tier, i) => (
                            <TierCard key={tier.id} tier={tier} index={i} />
                        ))}
                    </div>

                    {/* Add-ons Bar */}
                    <FadeInWhenVisible delay={0.3} className="mt-12">
                        <div className="rounded-xl border border-line bg-background p-6 md:p-8">
                            <h4 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-muted">
                                Optional System Add-ons
                            </h4>
                            <div className="mt-4 grid gap-4 text-base sm:grid-cols-3 sm:gap-6">
                                <div className="border-l-2 border-line pl-3.5">
                                    <p className="font-heading font-semibold text-ink">
                                        Extra Service Area Page
                                    </p>
                                    <p className="mt-1 text-muted">
                                        $49/mo per additional town beyond tier allowance
                                    </p>
                                </div>
                                <div className="border-l-2 border-line pl-3.5">
                                    <p className="font-heading font-semibold text-ink">
                                        Rush Build Deployment
                                    </p>
                                    <p className="mt-1 text-muted">
                                        +$497 one-time (live in 2 weeks instead of 4–6)
                                    </p>
                                </div>
                                <div className="border-l-2 border-line pl-3.5">
                                    <p className="font-heading font-semibold text-ink">
                                        Additional Staff Portal Seats
                                    </p>
                                    <p className="mt-1 text-muted">
                                        $25/mo per seat past the first 3 included
                                    </p>
                                </div>
                            </div>
                        </div>
                    </FadeInWhenVisible>
                </div>
            </section>

            {/* 2.5 AI Add-Ons — additive to Momentum Systems, same visual treatment on purpose */}
            <section id="ai-add-ons" className="scroll-mt-28 border-t border-line bg-background py-20 md:py-28">
                <div className="container-wide">
                    <FadeInWhenVisible>
                        <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                            AI Add-Ons
                        </p>
                        <h2 className="mt-3 max-w-2xl text-3xl font-bold md:text-4xl text-ink">
                            Momentum Systems gets customers finding and booking you.
                        </h2>
                        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
                            These add-ons take the manual work out of what happens next. Available
                            on their own or bundled with any Momentum Systems plan — bundle and
                            save 10–15% on the setup fee.
                        </p>
                    </FadeInWhenVisible>

                    <div className="mt-10 grid gap-8 xl:grid-cols-3 xl:items-stretch">
                        {ADDON_TIERS.map((tier, i) => (
                            <TierCard key={tier.id} tier={tier} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="container-wide pb-12">
                <p className="max-w-3xl border-l-2 border-accent pl-4 text-base leading-relaxed text-muted">CRM integrations require compatible API access on your existing provider’s plan. We confirm access, any provider fees, and the integration scope before quoting. Voice and messaging usage are agreed during scoping.</p>
            </section>
            {/* 3. Risk-Reversal & Guarantee Block */}
            <section className="border-t border-line bg-background py-20 md:py-28">
                <div className="container-wide">
                    <FadeInWhenVisible>
                        <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                            Our Commitments
                        </p>
                        <h2 className="mt-3 max-w-2xl text-3xl font-bold md:text-4xl text-ink">
                            Clear commitments. Ongoing support.
                        </h2>
                    </FadeInWhenVisible>

                    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <FadeInWhenVisible delay={0.05}>
                            <div className="card-hover group h-full rounded-2xl border border-line bg-surface p-8 transition-all hover:border-ink">
                                <span className="font-heading text-xs font-bold uppercase tracking-wider text-muted">
                                    01 / CONTRACT
                                </span>
                                <h3 className="mt-3 font-heading text-xl font-bold text-ink">
                                    No Long-Term Lock-In
                                </h3>
                                <p className="mt-3 text-xs leading-relaxed text-muted">
                                    Month-to-month after your initial 3-month ramp period. We earn your business every month through demonstrable bookings, reviews, and search rank.
                                </p>
                            </div>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible delay={0.1}>
                            <div className="card-hover group h-full rounded-2xl border border-line bg-surface p-8 transition-all hover:border-ink">
                                <span className="font-heading text-xs font-bold uppercase tracking-wider text-muted">
                                    02 / GUARANTEE
                                </span>
                                <h3 className="mt-3 font-heading text-xl font-bold text-ink">
                                    30-Day Satisfaction Guarantee
                                </h3>
                                <p className="mt-3 text-xs leading-relaxed text-muted">
                                    If the system isn&apos;t live and functioning as promised in your first 30 days, we issue an immediate 100% refund of your setup fee. No arguments.
                                </p>
                            </div>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible delay={0.15}>
                            <div className="card-hover group h-full rounded-2xl border border-line bg-surface p-8 transition-all hover:border-ink">
                                <span className="font-heading text-xs font-bold uppercase tracking-wider text-muted">
                                    03 / RIGOR
                                </span>
                                <h3 className="mt-3 font-heading text-xl font-bold text-ink">
                                    Built by Engineers, Not Resellers
                                </h3>
                                <p className="mt-3 text-xs leading-relaxed text-muted">
                                    Every line of code, automation sequence, and portal view is built by Kinetiq&apos;s internal software team — the same engineers shipping production AI systems for larger clients.
                                </p>
                            </div>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible delay={0.2}>
                            <div className="card-hover group h-full rounded-2xl border border-line bg-surface p-8 transition-all hover:border-ink">
                                <span className="font-heading text-xs font-bold uppercase tracking-wider text-muted">
                                    04 / OWNERSHIP
                                </span>
                                <h3 className="mt-3 font-heading text-xl font-bold text-ink">
                                    You Own Your Domain — Always
                                </h3>
                                <p className="mt-3 text-xs leading-relaxed text-muted">
                                    Your website lives on your own domain, registered in your name, not ours. If you ever leave, you leave with it.
                                </p>
                            </div>
                        </FadeInWhenVisible>
                    </div>
                </div>
            </section>

            {/* 4. Pricing FAQs */}
            <section className="border-t border-line bg-surface/50 py-24 md:py-32">
                <div className="container-wide max-w-4xl">
                    <FadeInWhenVisible>
                        <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                            Common Questions
                        </p>
                        <h2 className="mt-4 text-4xl font-bold md:text-5xl text-ink">
                            Pricing &amp; Contract Details
                        </h2>
                    </FadeInWhenVisible>

                    <div className="mt-12">
                        <FAQAccordion items={PRICING_FAQS} />
                    </div>
                </div>
            </section>

            {/* 5. Closing CTA */}
            <section className="bg-ink text-background">
                <div className="container-wide py-28 text-center md:py-36">
                    <FadeInWhenVisible>
                        <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-background/75">
                            Ready when you are
                        </p>
                        <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-bold leading-tight md:text-6xl">
                            Lock in your founding client pricing.
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg text-background/80">
                            Book a free 30-minute growth audit. We&apos;ll evaluate your service territory, show you what a custom Momentum System will look like, and lock in your founding rate.
                        </p>
                        <div className="mt-10">
                            <BracketButton calLink="kinetiq-solutions/30min">
                                Book your free growth audit
                            </BracketButton>
                        </div>
                    </FadeInWhenVisible>
                </div>
            </section>
        </main>
    );
}

