import BracketButton from "@/components/motion/BracketButton";
import { PricingCardAction } from "@/components/pricing/PricingCard";

export default function StratumAuditButton({
  children = "Book a Stratum Audit",
  className = "",
  pricing = false,
  popular = false,
}: {
  children?: React.ReactNode;
  className?: string;
  pricing?: boolean;
  popular?: boolean;
}) {
  if (pricing) {
    return (
      <PricingCardAction
        bookingIntent="stratum"
        popular={popular}
        className={className || "w-full text-center"}
      >
        {children}
      </PricingCardAction>
    );
  }
  return (
    <BracketButton
      calLink="kinetiq-solutions/30min"
      bookingIntent="stratum"
      className={className}
    >
      {children}
    </BracketButton>
  );
}
