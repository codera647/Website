# Deploy Checklist: Kinetiq website — first production deploy to Cloudflare Workers

**Target:** Cloudflare Workers (via OpenNext adapter) · **Cloudflare account:** moiz44386@gmail.com · **Repo:** https://github.com/Kinetiq-labs/Website.git (app in `/my-app`)

This sandbox has no network egress for npm/GitHub/Cloudflare auth and no credentials
for your accounts, so everything below is prepared but not yet run — you'll run these
locally. Each command is exact; run them from the `my-app` folder in order.

## What's already done (this session)

- [x] Added `@opennextjs/cloudflare` + `wrangler` to `package.json`, plus `preview`/`deploy`/`upload`/`cf-typegen` scripts
- [x] Created `wrangler.jsonc` (Worker name `kinetiq-website`, Node.js compat, assets binding)
- [x] Created `open-next.config.ts` (minimal — no R2 cache override yet)
- [x] Created `.dev.vars` for local Workers-runtime preview
- [x] Updated `next.config.ts` with `initOpenNextCloudflareForDev()`
- [x] Updated `.gitignore` for `.open-next/`, `.wrangler/`, `.dev.vars`, `cloudflare-env.d.ts`
- [x] Added `public/_headers` for static asset caching

## ⚠️ Known issue from this session

While testing locally in the sandbox I ran `git init`, which hit a file-locking bug on
the shared project mount and left a **broken, stuck `my-app/.git` folder** I could not
clean up (permission denied from this environment). Before you run `git init` yourself,
delete that folder manually (File Explorer → delete `my-app\.git`), or `git init` will
likely fail with a config error.

## Pre-Deploy (run locally)

- [ ] Delete the stray `my-app\.git` folder (see above) if present
- [ ] `npm install` — pulls in `@opennextjs/cloudflare`, `wrangler`, `resend`
- [ ] `npx wrangler login` — opens a browser, authorize against **moiz44386@gmail.com**
- [ ] Set production secrets on Cloudflare — `.env` only powers local `next dev`; the
      deployed Worker needs its own secrets set explicitly:
      - `npx wrangler secret put RESEND_API_KEY`
      - `npx wrangler secret put RESEND_FROM_EMAIL`
- [ ] `npm run preview` — builds and runs the app in the real Workers runtime locally;
      catches Workers-specific issues (Node API gaps, bindings) before shipping
- [ ] Submit the contact form and (once a role is open) the careers form against that
      preview — confirm both actually land in `contact@` / `careers@thekinetiq.solutions`

## Deploy

- [ ] `npm run deploy` — builds and pushes the Worker live
- [ ] Open the assigned `*.workers.dev` URL and click through every page
- [ ] Cloudflare dashboard → Workers & Pages → `kinetiq-website` → Domains & Routes →
      add `thekinetiq.solutions` (and `www`) as a custom domain

## Push to GitHub

```
git init                                                 # only if you deleted the stray .git above
git remote add origin https://github.com/Kinetiq-labs/Website.git
git add .
git commit -m "Add Cloudflare Workers deployment (OpenNext)"
git push -u origin main
```

If `Website.git` already has commits (e.g. from another machine), `git pull --rebase
origin main` first to avoid a conflicting-history push rejection.

## Post-Deploy verification

- [ ] Home, Work, Services, About, Careers, Contact all load on the live domain
- [ ] Contact form → email lands in `contact@thekinetiq.solutions`, reply-to is the visitor's address
- [ ] Careers apply form → CV attachment lands in `careers@thekinetiq.solutions`
- [ ] Footer email link opens Gmail compose correctly
- [ ] Custom domain resolves over HTTPS with a valid certificate

## Rollback

- `npx wrangler rollback` reverts instantly to the previous deployed Worker version —
  use this first if something's broken, before debugging forward.

## Not required for this launch (later phases)

- Cloudflare AI Search / Vectorize (per-project + site-wide chatbots) — separate,
  additive project once the site itself is live
- R2-backed incremental cache for ISR — only matters once pages need revalidation;
  everything here is effectively static/light-dynamic for now
