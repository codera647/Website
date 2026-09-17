# Stratum Systems implementation

Implemented in the local Kinetiq project on 17 September 2026. The live domain has not been deployed from this task.

## Result

- Added `/stratum-systems` with all ten requested sections, the exact positioning and tagline, a lightweight layered SVG architecture visual, subtle lifecycle reveals, eight capabilities, explicitly hypothetical examples, qualification guidance, pricing previews and six FAQs.
- Added equal Momentum and Stratum cards to the homepage using the existing Space Grotesk/Inter typography, rectangular cards and warm monochrome palette. Stratum uses a complementary pale charcoal-grey surface.
- Added a keyboard-accessible Systems disclosure on desktop, a scrollable mobile navigation with focus management, and Stratum in the footer.
- Added a native segmented pricing navigator linking to `#momentum` and `#stratum`. Momentum is the default. Both sections remain server-rendered and visible; choosing a system scrolls to it rather than removing the other system from the page.
- Added Blueprint, Launch, Production and Scale pricing, founding/standard price comparisons, Blueprint credit terms, stabilization periods, operations inclusions/exclusions and the requested pricing/delivery notes. Scale always uses “From” pricing.
- Added Stratum metadata, Service/FAQ/Breadcrumb schema, sitemap entry and a permanent 308 redirect from `/production-ai-systems`.
- Extended the existing booking entry point with a Stratum-specific context. Existing Momentum buttons retain their original booking options.
- Matched Stratum pricing to Momentum after the design review: shared card frames, popular-tier treatment, typography, feature checkmarks, hover lift/underline and light-to-dark bracket buttons. The Blueprint uses the same card treatment; the closing pricing CTA uses Momentum's charcoal and centered styling. Monthly operations and one-time implementation prices now follow Momentum's price hierarchy.
- Matched the dedicated Stratum page to Momentum's section palette, spacing, heading sizes, full-width pillar blocks, workflow and audience cards, comparison table, FAQ and centered closing CTA. Cards use the existing hover lift, bottom underline and animated arrows. The architecture illustration now uses the same white card and warm monochrome colors; its bespoke continuous animations were removed.

## Reusable components

`PricingCardFrame`, `PricingCardAction` and `PricingFeatures` in `PricingCard.tsx` now share Momentum's original card, hover and button presentation across both systems.

`systemPageStyles.ts` records Momentum's existing presentation classes for Stratum's sections and blocks. The dedicated Momentum page remains unchanged. Stratum audit buttons use the same default `BracketButton` animation as Momentum.

`StratumPricingCard` serves both the page preview and detailed pricing section. `PricingFeatures` renders the common feature list. `StratumAuditButton` applies the shared bracket-button styling and booking context. `PricingSystemSelector`, `SystemsMenu`, `SystemsOverview` and `StratumArchitecture` keep their respective presentation and interaction concerns separate. All Stratum content and pricing live in `src/data/stratum.ts`; existing Momentum pricing remains in its original structure.

## Created files

- `src/app/(site)/stratum-systems/page.tsx`
- `src/data/stratum.ts`
- `src/components/nav/SystemsMenu.tsx`
- `src/components/pricing/PricingSystemSelector.tsx`
- `src/components/pricing/StratumPricing.tsx`
- `src/components/pricing/StratumPricingCard.tsx`
- `src/components/pricing/PricingCard.tsx`
- `src/components/systems/StratumArchitecture.tsx`
- `src/components/systems/StratumAuditButton.tsx`
- `src/components/systems/systemPageStyles.ts`
- `src/components/systems/SystemsOverview.tsx`
- `docs/stratum-handoff.md`

## Modified files

- `src/app/(site)/page.tsx`: homepage system introduction.
- `src/app/(site)/pricing/page.tsx`: joint metadata/intro, segmented navigator and appended Stratum section. Original Momentum hero becomes an H2 beneath the joint H1.
- `src/app/globals.css`: homepage Stratum surface, reduced-motion treatment and visible keyboard focus.
- `src/app/sitemap.ts`: Stratum entry.
- `src/components/nav/Nav.tsx`: system disclosure, responsive navigation and keyboard focus.
- `src/components/nav/Footer.tsx`: sibling Stratum link.
- `src/components/booking/CallTypeModal.tsx`: Stratum context, focus trap, focus restoration and scroll lock.
- `src/components/motion/BracketButton.tsx`: optional Stratum booking intent; existing callers keep their behavior.
- `src/components/motion/FadeInWhenVisible.tsx`: immediate rendering under reduced motion.
- `src/components/motion/FAQAccordion.tsx`: immediate expansion under reduced motion.
- `next.config.ts`: permanent legacy-route redirect.
- `eslint.config.mjs`, `package.json`, `package-lock.json`: repaired the existing incompatible ESLint configuration using Next.js 15's FlatCompat approach and an explicit development dependency.
- `src/app/(site)/ai-engagements/page.tsx`: existing portfolio link uses Next Link to resolve a pre-existing lint error.
- `src/app/(site)/careers/[slug]/page.tsx`: existing never-reassigned variable uses const to resolve a pre-existing lint error.
- `src/app/admin/page.tsx`: escaped an existing apostrophe to resolve a pre-existing lint error.

## Verification

| Check                                                     | Result                                                                                                                                                                                                                                                                                                                          |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prettier 3.6.2 on new and substantially edited components | Write and check passed. No formatter was configured previously.                                                                                                                                                                                                                                                                 |
| `npm run lint`                                            | Passed: zero errors, eight existing warnings in unrelated admin/chat/effects/follow-up code.                                                                                                                                                                                                                                    |
| `npx tsc --noEmit`                                        | Passed.                                                                                                                                                                                                                                                                                                                         |
| `npm run build`                                           | Passed: optimized Next.js production build, including `/stratum-systems`.                                                                                                                                                                                                                                                       |
| Existing automated tests                                  | No test command or test suite is configured. Used focused source/data assertions, HTTP checks and browser interaction checks.                                                                                                                                                                                                   |
| Momentum preservation                                     | Compared original and updated tier arrays, add-on arrays and pricing FAQs; exact match after normalizing line endings. Dedicated Momentum page remains unchanged.                                                                                                                                                               |
| Pricing accuracy                                          | Assertions passed for all founding/standard prices, timelines, stabilization periods, Blueprint pricing, Most Popular status and Scale's From flag.                                                                                                                                                                             |
| Server responses/SEO                                      | Homepage, Stratum and pricing return 200 with one H1 each. Both pricing systems exist in server HTML. Stratum metadata/schema and sitemap entry verified. Legacy route returns 308 to `/stratum-systems`.                                                                                                                       |
| Responsive browser checks                                 | Homepage, Stratum and pricing checked at widths 390, 768 and 1440. Document width stays within viewport. Homepage sibling cards have equal height at tablet and desktop. Pricing selector fits mobile.                                                                                                                          |
| Keyboard                                                  | Pricing hash links, desktop Systems disclosure, mobile navigation, Stratum FAQ and audit dialog verified. Visible focus, Escape, focus restoration and dialog focus loops work.                                                                                                                                                 |
| CTA destinations                                          | Homepage Stratum card opens the dedicated page; lifecycle link reaches `#stratum-process`; pricing link reaches `/pricing#stratum`; Blueprint/Scale buttons open Stratum booking context; existing Momentum audit opens its original context. All new href destinations reviewed.                                               |
| Reduced motion                                            | The architecture SVG is static. Shared reveals render immediately, card hover transforms are disabled and FAQ transitions use zero duration when reduced motion is requested. Stratum's eyebrow ping is disabled too. Branches and CSS verified in source; the connected browser tool does not expose media-preference emulation, so an actual reduced-motion browser session was not simulated. |

## Dedicated system-page design follow-up

Source assertions confirm that 20 section, typography, card and CTA class strings match the existing Momentum page. All ten Stratum sections and the original Stratum business data remain intact. TypeScript, lint, formatting and an isolated optimized production build pass. After restarting the task-owned local preview, Stratum, Momentum and pricing each return HTTP 200 with one H1. The build was repeated in a temporary copy because the running development servers share the workspace build directory. The connected browser timed out on navigation and screenshots during this follow-up, so the prior responsive and interaction checks above do not constitute visual verification of this latest layout.

Automatic approval review rejected cleanup with the reason "blocked by policy", including a narrower attempt to remove only the copied environment files. These temporary directories remain outside the project, with a junction to the project's dependencies and a copied `.env.local`:

- `C:\Users\MEGA IT SOLUTION\AppData\Local\Temp\kinetiq-stratum-check-d9abc7c1881644acbc07cb21d12c042e`
- `D:\website\kinetiq-stratum-check-ddf809474c06482f996fb666d82623f0`

## Navigation and homepage consistency follow-up

Updated on 18 September 2026. Systems is now a regular desktop navigation disclosure between Services and Work, with the same typography and underline as the other items. The mobile menu places Systems in the main item order with links to Momentum, Stratum and pricing. Footer system links share one template, matching width, height, colors, dots, lift and arrow effects. Both homepage cards share the warm surface, border and existing card-hover treatment, with aligned detail paragraphs on desktop.

Browser checks passed for desktop keyboard disclosure/Escape, mobile navigation/Escape, equal footer button sizes (256 x 56 pixels), equal tablet/desktop card sizes and absence of horizontal overflow at 390 and 768 pixels. A transient local D1 error cleared after reloading. TypeScript and focused ESLint checks passed.

## Assumptions

- No dedicated Stratum Cal.com event was supplied. “Stratum Audit” uses the existing `kinetiq-solutions/30min` event; the technical discussion uses `kinetiq-solutions/project-discussion`. Existing events, forms and integrations were preserved. An audit is the discovery conversation; the Blueprint is the separately priced deliverable.
- No monthly support-hour quantity was specified, so the allowance is explicitly confirmed during the Blueprint rather than inventing a number.
- No public analytics integration exists in the project, so no tracking dependency or CTA events were introduced.
- The latest Stratum brief controls this implementation. Momentum's existing commercial scope/pricing takes precedence over discrepancies in older business notes; it was preserved as requested.
- No external case-study claims, client results or performance metrics were added to Stratum.

## Local previews

The development server is running at `http://127.0.0.1:3000`.

- [Homepage](http://127.0.0.1:3000/)
- [Homepage system comparison](http://127.0.0.1:3000/#systems)
- [Stratum Systems](http://127.0.0.1:3000/stratum-systems)
- [Pricing](http://127.0.0.1:3000/pricing)
- [Direct Stratum pricing](http://127.0.0.1:3000/pricing#stratum)

These previews are local to this computer. Production publishing remains a separate step.
