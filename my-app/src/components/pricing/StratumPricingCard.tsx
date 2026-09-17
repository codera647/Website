import type { StratumTier } from "@/data/stratum";
import StratumAuditButton from "@/components/systems/StratumAuditButton";
import {
  PricingCardFrame,
  PricingCardAction,
  PricingFeatures,
} from "./PricingCard";

export default function StratumPricingCard({
  tier,
  preview = false,
  index = 0,
}: {
  tier: StratumTier;
  preview?: boolean;
  index?: number;
}) {
  const prefix = tier.from ? "From " : "";
  return (
    <PricingCardFrame popular={tier.popular} index={index}>
      <div>
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-heading text-2xl font-bold text-ink">
            {tier.name}
          </h3>
          {tier.popular && (
            <span className="rounded-none bg-ink px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-wider text-background">
              Most Popular
            </span>
          )}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          {tier.description}
        </p>
        <div className="mt-8 border-y border-line py-6">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="sr-only">Operations plan. Standard price:</span>
            <span className="text-sm text-muted line-through">
              {prefix}
              {tier.standardOperations}
            </span>
            <span className="sr-only">Founding price:</span>
            <span className="font-heading text-4xl font-bold text-ink">
              {prefix}
              {tier.operations}
            </span>
            <span className="text-xs font-medium text-muted">/ month</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted">Implementation:</span>
            <span className="sr-only">Standard price:</span>
            <span className="text-muted line-through">
              {prefix}
              {tier.standardImplementation}
            </span>
            <span className="sr-only">Founding price:</span>
            <span className="font-heading font-bold text-ink">
              {prefix}
              {tier.implementation}
            </span>
            <span className="text-muted/80">(one-time build fee)</span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Operations begin after {tier.stabilization}-day stabilization.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Estimated delivery:{" "}
            <strong className="font-heading font-semibold text-ink">
              {tier.delivery}
            </strong>
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
      </div>
      <div className="mt-10 border-t border-line pt-6">
        {preview ? (
          <PricingCardAction href="/pricing#stratum" popular={tier.popular}>
            View full scope
          </PricingCardAction>
        ) : (
          <StratumAuditButton pricing popular={tier.popular}>
            {tier.cta}
          </StratumAuditButton>
        )}
      </div>
    </PricingCardFrame>
  );
}
