import BracketButton from "@/components/motion/BracketButton";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import type { EngagementTier } from "@/data/aiEngagements";

/**
 * Numbered engagement-stage ladder for AI Automation & Generative AI
 * Engagements (Track 2) — intentionally NOT the SaaS-style pricing-card
 * grid used on /pricing. Each stage shows name, "starting at" price,
 * scope, and timeline, and every CTA routes to a scoping call rather
 * than a self-serve checkout. See ProcessSection.tsx for the numbered-
 * card visual language this borrows from elsewhere on the site.
 */
export default function EngagementLadder({ tiers }: { tiers: EngagementTier[] }) {
    return (
        <div className="space-y-6">
            {tiers.map((tier, i) => (
                <FadeInWhenVisible key={tier.id} delay={i * 0.08}>
                    <div
                        className={`card-hover group rounded-2xl border bg-[#7a7a7c] p-8 transition-all md:p-10 ${
                            tier.badge === "Flagship" ? "relative border-ink shadow-lg ring-1 ring-ink/10" : "border-line"
                        }`}
                    >
                        <div className="grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-start">
                            {/* Stage number */}
                            <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-1">
                                <p className="font-heading text-4xl font-bold text-line transition-colors duration-300 group-hover:text-ink lg:text-5xl">
                                    {tier.stage}
                                </p>
                                {tier.badge && (
                                    <span className="rounded-none bg-ink px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-wider text-white">
                                        {tier.badge}
                                    </span>
                                )}
                            </div>

                            {/* Scope */}
                            <div>
                                <h3 className="font-heading text-2xl font-bold text-ink">{tier.name}</h3>
                                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                                    {tier.description}
                                </p>
                                <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    {tier.scope.map((item) => (
                                        <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-ink/90">
                                            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-ink" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Price + timeline + CTA */}
                            <div className="flex flex-col gap-4 border-t border-line pt-6 lg:min-w-[220px] lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                                <div>
                                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                                        Starting at
                                    </p>
                                    <p className="mt-1 font-heading text-2xl font-bold text-ink">{tier.price}</p>
                                    {tier.priceNote && (
                                        <p className="mt-0.5 text-xs text-muted">{tier.priceNote}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                                        Typical timeline
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-ink">{tier.timeline}</p>
                                </div>
                                <BracketButton
                                    calLink="kinetiq-solutions/30min"
                                    className="mt-1 w-full text-center"
                                    buttonClassName={
                                        tier.badge === "Flagship"
                                            ? "bg-ink text-white group-hover:bg-ink-soft"
                                            : "bg-surface text-ink group-hover:bg-ink group-hover:text-white"
                                    }
                                >
                                    {tier.ctaText}
                                </BracketButton>
                                {tier.ctaNote && (
                                    <p className="text-[11px] leading-relaxed text-muted">{tier.ctaNote}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </FadeInWhenVisible>
            ))}
        </div>
    );
}
