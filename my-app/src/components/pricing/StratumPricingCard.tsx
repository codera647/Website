import Link from "next/link";
import type { StratumTier } from "@/data/stratum";
import StratumAuditButton from "@/components/systems/StratumAuditButton";

export function PricingFeatures({ features }: { features: string[] }) {
  return (
    <ul className="space-y-3 text-sm leading-relaxed text-ink-soft">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-3">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="mt-1 size-4 shrink-0"
          >
            <path d="m4 10 4 4 8-8" />
          </svg>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

export default function StratumPricingCard({
  tier,
  preview = false,
}: {
  tier: StratumTier;
  preview?: boolean;
}) {
  const prefix = tier.from ? "From " : "";
  return (
    <article
      className={`relative flex h-full flex-col border p-6 sm:p-8 ${tier.popular ? "border-ink bg-stratum-surface shadow-[0_4px_0_0_var(--color-ink)]" : "border-line bg-background"}`}
    >
      <div className="mb-5 min-h-7">
        {tier.popular ? (
          <span className="inline-block bg-ink px-3 py-1.5 font-heading text-xs font-semibold uppercase tracking-wider text-background">
            Most Popular
          </span>
        ) : (
          <span className="font-heading text-xs uppercase tracking-wider text-muted">
            {tier.from ? "Custom scope" : "Focused delivery"}
          </span>
        )}
      </div>
      <h3 className="font-heading text-2xl font-bold tracking-tight">
        {tier.name}
      </h3>
      <p className="mt-3 min-h-16 text-sm leading-relaxed text-muted">
        {tier.description}
      </p>
      <div className="my-7 border-y border-line py-6">
        <p className="font-heading text-xs uppercase tracking-wider text-muted">
          Implementation · one-time
        </p>
        <p className="mt-3 text-sm text-muted">
          <span className="sr-only">Standard price: </span>
          <s>
            {prefix}
            {tier.standardImplementation}
          </s>
        </p>
        <p className="mt-1 font-heading text-3xl font-bold tracking-tight">
          <span className="sr-only">Founding price: </span>
          {prefix}
          {tier.implementation}
        </p>
        <p className="mt-5 font-heading text-xs uppercase tracking-wider text-muted">
          Ongoing operations
        </p>
        <p className="mt-2 text-sm text-muted">
          <span className="sr-only">Standard price: </span>
          <s>
            {prefix}
            {tier.standardOperations}/month
          </s>
        </p>
        <p className="mt-1 font-heading text-lg font-bold">
          <span className="sr-only">Founding price: </span>
          {prefix}
          {tier.operations}
          <span className="font-body text-sm font-normal text-muted">
            /month
          </span>
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Begins after {tier.stabilization}-day stabilization.
        </p>
        <p className="mt-5 text-sm text-ink">
          Estimated delivery: <strong>{tier.delivery}</strong>
        </p>
      </div>
      {!preview && (
        <>
          <PricingFeatures features={tier.features} />
          {tier.boundary && (
            <p className="mt-6 border-t border-line pt-5 text-xs leading-relaxed text-muted">
              <strong className="text-ink">Scope boundary. </strong>
              {tier.boundary}
            </p>
          )}
        </>
      )}
      <div className="mt-auto pt-8">
        {preview ? (
          <Link
            href="/pricing#stratum"
            className="flex min-h-12 items-center justify-between border-t border-line pt-5 font-heading text-sm font-semibold"
          >
            View full scope <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <StratumAuditButton className="w-full text-left">
            {tier.cta}
          </StratumAuditButton>
        )}
      </div>
    </article>
  );
}
