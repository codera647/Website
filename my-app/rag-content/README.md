# Kinetiq AI assistant — setup checklist

This powers the floating "Ask" widget on every page (site-wide assistant)
and, later, a dedicated assistant on each project page. Built on Cloudflare
AI Search (managed RAG) + Workers AI, using an open-source model.

## What's already done (code side)

- `wrangler.jsonc` — added the `ai` binding (`env.AI`)
- `src/app/api/chat/route.ts` — the API route both the site-wide widget and
  (later) per-project assistants call. Takes `{ message, projectSlug? }`.
  No `projectSlug` = searches everything (site-wide). With `projectSlug` =
  filtered to that project's folder only.
- `src/components/chat/SiteChatWidget.tsx` — the floating button + chat
  panel, mounted in `src/app/layout.tsx` so it's on every page.
- `rag-content/site/*.md` — drafted general company content (about,
  services, process, FAQ, work overview), ready to upload as the
  site-wide knowledge base.

`ProjectAssistantSketch.tsx` on project pages is intentionally left as the
inert "coming soon" preview for now — that becomes real once each
project's dedicated content (domain scrape, GitHub README, PDF) exists in
`rag-content/projects/<slug>/` and gets uploaded, following the same
pattern documented below.

## What you need to do in the Cloudflare dashboard

1. **Create an R2 bucket.** Dashboard → R2 → Create bucket. Name it
   `kinetiq-rag-sources` (or whatever you like, it just needs to match
   what you point AI Search at in step 2). Requires an active R2
   subscription (has a free tier).

2. **Upload the site content.** In that bucket, upload the three files in
   `rag-content/site/` from this repo into a folder path of
   `site/` inside the bucket — so the bucket ends up with:
   ```
   site/company-overview.md
   site/faq.md
   site/work-overview.md
   ```
   (You can drag-and-drop these three files via the R2 dashboard's upload
   button, into that `site/` folder — create the folder first if the
   uploader doesn't do it automatically.)

3. **Create the AI Search instance.** Dashboard → AI Search (formerly
   AutoRAG) → Create instance.
   - Name it **exactly** `kinetiq-knowledge` — the code in
     `src/app/api/chat/route.ts` calls `env.AI.autorag("kinetiq-knowledge")`,
     so this name must match exactly.
   - Data source: select the `kinetiq-rag-sources` R2 bucket from step 1.
   - Generation model: this doesn't strictly need to match what's
     hardcoded in the route (the route passes `model` explicitly per
     request), but set it to `@cf/meta/llama-3.3-70b-instruct-fp8-fast`
     anyway so the instance's own default matches, in case that's ever
     used as a fallback.
   - Let it run its initial indexing pass (automatic — it'll chunk and
     embed the uploaded markdown files into its managed vector store).

4. **Re-check the Worker's build/deploy settings still have the secrets.**
   This is unrelated to AI Search specifically, but while you're in the
   dashboard: confirm `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are still
   set under Settings → Builds → Variables and secrets (these have been
   known to reset after disconnecting/reconnecting the Git integration).

5. **Push this code and let the build run**, then visit the live site —
   the "Ask" button should appear bottom-right on every page. Try one of
   the suggested questions or ask something like "What services does
   Kinetiq offer?" and confirm it answers using the uploaded content
   (not a generic/hallucinated answer).

## Adding a project's dedicated assistant later

When you're ready to wire up a specific project's assistant (e.g.
Synapse):

1. Gather that project's material — a written summary/architecture doc,
   the GitHub README content, a text export of the live project's public
   pages, and/or the one-pager PDF.
2. Save them as markdown/text files under `rag-content/projects/synapse/`
   in this repo (for your own record), and upload the same files into the
   R2 bucket under `projects/synapse/` (folder name **must** match the
   project's `slug` in `src/data/work.ts` exactly — that's what the
   folder-filter in `/api/chat` matches against).
3. AI Search auto-reindexes the bucket, so no code changes needed for the
   content side.
4. Tell me when a project's content is uploaded and I'll swap that
   project's `ProjectAssistantSketch` placeholder for the real, wired-up
   chat panel (same UI pattern as `SiteChatWidget`, but scoped to that
   project's `projectSlug`).

## Notes

- The current `/api/chat` implementation is non-streaming (waits for the
  full answer, then returns it in one response). Streaming can be added
  as a fast-follow once this is confirmed working end-to-end — didn't
  want to guess at Cloudflare's streaming wire format without a live
  instance to test against.
- Every response is grounded only in the uploaded documents (the system
  prompt instructs the model to say "I don't know" and point to the
  contact form rather than guess) — so answer quality is entirely a
  function of what's uploaded to R2. Keep those markdown files accurate
  and update them whenever the site's real copy changes.
