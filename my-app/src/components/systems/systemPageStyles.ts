/** Canonical class patterns from the existing Momentum Systems page. */
export const systemPageStyles = {
  hero: "container-wide pb-20 pt-36 md:pb-28 md:pt-44",
  heroBadge:
    "inline-flex items-center gap-2.5 rounded-none border border-line bg-surface px-3.5 py-1.5 font-heading text-xs font-medium uppercase tracking-[0.24em] text-muted shadow-sm",
  heroTitle:
    "mt-6 max-w-4xl font-heading text-5xl font-bold tracking-tight text-ink md:text-7xl",
  heroDescription:
    "mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl",
  surfaceSection: "border-t border-line bg-surface/50 py-24 md:py-32",
  lightSection: "border-t border-line bg-background py-24 md:py-32",
  eyebrow:
    "font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted",
  heading: "mt-4 max-w-2xl text-4xl font-bold md:text-5xl text-ink",
  description: "mt-4 max-w-xl text-base leading-relaxed text-muted",
  pillarCard:
    "card-hover group grid gap-8 rounded-2xl border border-line bg-background p-8 transition-all hover:border-ink md:p-12 lg:grid-cols-12 lg:gap-12",
  workflowCard:
    "card-hover group flex h-full flex-col justify-between rounded-2xl border border-line bg-surface p-7 transition-all hover:border-ink",
  contentCard:
    "card-hover group h-full rounded-2xl border border-line bg-surface p-8 transition-all hover:border-ink",
  practicePanel:
    "mt-6 rounded-xl border border-line bg-surface p-4 text-xs leading-relaxed text-muted transition-colors group-hover:bg-background group-hover:border-ink/20",
  comparison:
    "card-hover mt-14 rounded-2xl border border-line bg-background shadow-sm transition-all hover:border-ink",
  primaryLink:
    "rounded-none bg-ink px-7 py-3.5 font-heading text-sm font-semibold text-background transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink-soft shadow-sm",
  secondaryLink:
    "rounded-none border border-line bg-background px-7 py-3.5 font-heading text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-ink",
  closing: "bg-ink text-background",
  closingContainer: "container-wide py-28 text-center md:py-36",
  closingEyebrow:
    "font-heading text-xs font-medium uppercase tracking-[0.28em] text-background/50",
  closingHeading:
    "mx-auto mt-5 max-w-2xl text-4xl font-bold leading-tight md:text-6xl",
  closingDescription: "mx-auto mt-6 max-w-xl text-lg text-background/60",
} as const;
