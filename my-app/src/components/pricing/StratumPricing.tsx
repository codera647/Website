import Link from "next/link";
import {
  stratumBlueprint,
  stratumTiers,
  stratumOperations,
  stratumExclusions,
  stratumPricingNote,
  stratumDeliveryNote,
} from "@/data/stratum";
import StratumPricingCard, { PricingFeatures } from "./StratumPricingCard";
import StratumAuditButton from "@/components/systems/StratumAuditButton";

export default function StratumPricing() {
  return (
    <section
      id="stratum"
      className="scroll-mt-28 border-t border-line py-24 md:py-32"
      aria-labelledby="stratum-pricing-heading"
    >
      <div className="container-wide">
        <p className="font-heading text-xs uppercase tracking-[0.24em] text-muted">
          Stratum Systems by Kinetiq · All prices in USD
        </p>
        <h2
          id="stratum-pricing-heading"
          className="mt-4 max-w-4xl font-heading text-4xl font-bold tracking-tight md:text-6xl"
        >
          Production intelligence. Clearly scoped.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          A separate system for custom AI products and infrastructure. Start
          with a Blueprint, then choose the implementation and operations plan
          your system needs.
        </p>
        <Link
          href="/stratum-systems"
          className="mt-5 inline-flex min-h-11 items-center gap-3 font-heading text-sm font-semibold underline underline-offset-4"
        >
          Explore Stratum Systems <span aria-hidden="true">↗</span>
        </Link>
        <article
          id="stratum-blueprint"
          className="mt-12 grid scroll-mt-28 gap-8 border border-ink bg-stratum-surface p-6 sm:p-8 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:p-10"
        >
          <div>
            <p className="font-heading text-xs uppercase tracking-[0.18em] text-muted">
              01 / Every implementation starts here
            </p>
            <h3 className="mt-4 font-heading text-3xl font-bold">
              Stratum Blueprint
            </h3>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
              {stratumBlueprint.description}
            </p>
            <p className="mt-6 text-sm text-muted">
              <span className="sr-only">Standard price: </span>
              <s>{stratumBlueprint.standard} one-time</s>
            </p>
            <p className="mt-1 font-heading text-4xl font-bold">
              <span className="sr-only">Founding price: </span>
              {stratumBlueprint.founding}
              <span className="ml-2 font-body text-sm font-normal text-muted">
                one-time
              </span>
            </p>
            <p className="mt-4 text-sm">
              Estimated delivery: <strong>{stratumBlueprint.delivery}</strong>
            </p>
            <div className="mt-8">
              <StratumAuditButton />
            </div>
          </div>
          <div>
            <PricingFeatures features={stratumBlueprint.features} />
            <p className="mt-7 border-t border-ink/20 pt-5 text-sm leading-relaxed">
              <strong>Blueprint credit. </strong>
              {stratumBlueprint.credit}
            </p>
          </div>
        </article>
        <div className="mb-8 mt-16">
          <p className="font-heading text-xs uppercase tracking-[0.18em] text-muted">
            02 / Implementation
          </p>
          <h3 className="mt-3 font-heading text-2xl font-bold">
            Three paths to production.
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Founding implementation and operations prices are shown below.
            Standard prices are crossed out.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {stratumTiers.map((tier) => (
            <StratumPricingCard key={tier.id} tier={tier} />
          ))}
        </div>
        <section
          aria-labelledby="stratum-operations-heading"
          className="mt-16 border-y border-line py-12"
        >
          <p className="font-heading text-xs uppercase tracking-[0.18em] text-muted">
            03 / Ongoing operations
          </p>
          <h3
            id="stratum-operations-heading"
            className="mt-3 font-heading text-3xl font-bold"
          >
            Keep the system dependable after launch.
          </h3>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
            The monthly operations plan begins after the included post-launch
            stabilization period: 30 days for Launch, 60 days for Production and
            90 days for Scale. Your defined monthly support-hour allowance and
            operating requirements are confirmed during the Blueprint.
          </p>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            <div>
              <h4 className="mb-5 font-heading text-lg font-semibold">
                Included in the operations plan
              </h4>
              <PricingFeatures features={stratumOperations} />
            </div>
            <div>
              <h4 className="mb-5 font-heading text-lg font-semibold">
                Separate scope or client-paid costs
              </h4>
              <ul className="space-y-3 text-sm leading-relaxed text-muted">
                {stratumExclusions.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted">
          <p>{stratumPricingNote}</p>
          <p>{stratumDeliveryNote}</p>
        </div>
        <div className="mt-12 flex flex-col gap-6 border border-line bg-surface p-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-heading text-xl font-bold">
              Define your system before development.
            </h3>
            <p className="mt-2 text-sm text-muted">
              Start with a practical architecture and a fixed-price
              implementation proposal.
            </p>
          </div>
          <StratumAuditButton className="shrink-0" />
        </div>
      </div>
    </section>
  );
}
