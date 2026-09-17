import BracketButton from "@/components/motion/BracketButton";

export default function StratumAuditButton({
  children = "Book a Stratum Audit",
  dark = false,
  className = "",
}: {
  children?: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <BracketButton
      calLink="kinetiq-solutions/30min"
      bookingIntent="stratum"
      className={className}
      buttonClassName={
        dark
          ? "bg-background text-ink group-hover:bg-background/85"
          : "bg-ink text-background group-hover:bg-ink-soft"
      }
      bracketClassName={dark ? "border-background/60" : "border-ink/60"}
    >
      {children}
    </BracketButton>
  );
}
