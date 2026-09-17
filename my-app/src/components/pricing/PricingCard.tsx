import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import BracketButton from "@/components/motion/BracketButton";

/** The original Momentum presentation, shared by both systems. */
export function pricingCardClassName(popular = false) {
  return `card-hover group flex w-full flex-col justify-between rounded-2xl border bg-background p-8 transition-all md:p-10 ${popular ? "relative border-ink shadow-lg ring-1 ring-ink/10" : "border-line"}`;
}

export function PricingCardFrame({
  children,
  popular = false,
  index = 0,
}: {
  children: React.ReactNode;
  popular?: boolean;
  index?: number;
}) {
  return (
    <FadeInWhenVisible delay={index * 0.1} className="flex">
      <div className={pricingCardClassName(popular)}>{children}</div>
    </FadeInWhenVisible>
  );
}

export function PricingCardAction({
  children,
  popular = false,
  href,
  bookingIntent,
  className = "w-full text-center",
}: {
  children: React.ReactNode;
  popular?: boolean;
  href?: string;
  bookingIntent?: "stratum";
  className?: string;
}) {
  return (
    <BracketButton
      href={href}
      calLink={href ? undefined : "kinetiq-solutions/30min"}
      bookingIntent={bookingIntent}
      className={className}
      buttonClassName={
        popular
          ? "bg-ink text-background group-hover:bg-ink-soft"
          : "bg-surface text-ink group-hover:bg-ink group-hover:text-background"
      }
    >
      {children}
    </BracketButton>
  );
}

export function PricingFeatures({ features }: { features: string[] }) {
  return (
    <ul className="mt-8 space-y-3.5 text-xs leading-relaxed text-ink/90">
      {features.map((feature) => {
        const isHeading =
          feature.startsWith("Everything in") || feature.startsWith("Pick one");
        return (
          <li
            key={feature}
            className={`flex items-start gap-2.5 ${isHeading ? "font-heading font-semibold text-ink border-b border-line pb-2" : ""}`}
          >
            {!isHeading && (
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
            <span>{feature}</span>
          </li>
        );
      })}
    </ul>
  );
}
