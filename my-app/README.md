# Kinetiq City

A cinematic, scroll-driven journey through a low-poly robotic city — the
marketing/portfolio site for **Kinetiq** (AI Automation · Web Development ·
Generative AI). As the visitor scrolls, the camera flies through "Kinetiq
City" along a fixed path; each district landmark is a milestone where a
content panel fades in.

## Stack

- Next.js (App Router, TypeScript)
- React Three Fiber + drei (`ScrollControls` drives the camera; `Scroll html`
  keeps milestone copy in real DOM)
- Tailwind CSS v4 + CSS variables for the theme
- Meshy AI for 3D landmark generation (build-time only)
- gltf-transform + Draco for asset compression

## Commands

```bash
npm run dev              # dev server
npm run build            # production build
npm run generate:assets  # (re)generate Meshy landmarks — spends API credits!
```

## Content editing

All milestone copy, project cards, and testimonials live in
[`app/data/milestones.ts`](app/data/milestones.ts) — editable without touching
any 3D code. City geometry/camera positions live in
[`app/data/cityLayout.ts`](app/data/cityLayout.ts).

> ⚠️ Milestone eyebrow/title/body copy is still the DRAFT text from the
> project brief. Projects and testimonials are real.

## 3D assets (Meshy)

- Manifest: [`assets.manifest.json`](assets.manifest.json) — prompts, task
  ids, status, triangle counts. The generation script resumes from it and
  never regenerates a completed asset unless `--force` is passed.
- `MESHY_API_KEY` lives in `.env` and is read **only** by
  `scripts/generate-assets.mjs` (Node, build-time). It is never imported by
  app code and never exposed via `NEXT_PUBLIC_*`.
- Downloaded GLBs land in `public/models/<district>/` and are Draco-compressed
  in place.

## Accessibility & fallbacks (decisions)

- **`prefers-reduced-motion: reduce` → full static page.** Rather than
  keeping WebGL with snap-scrolling, reduced-motion visitors get
  `StaticExperience`: a normal scrolling document with the identical
  milestone content. Same fallback serves browsers without WebGL.
- **SEO / screen readers:** when the 3D city is active, the complete static
  version stays in the DOM inside an `sr-only` container, and a
  "Skip to content" link jumps to it.
- **Mobile:** the 3D city runs with reduced instancing density, capped DPR,
  and antialiasing off. If real-device testing shows low-end phones still
  struggle, switch `CityExperience` to serve `StaticExperience` on small
  screens.
