-- Family Offices Intelligence — project insert / update
-- Run against production D1:
--   npx wrangler d1 execute kinetiq-db --remote --file=seed-fo-intelligence.sql
-- Run against local D1:
--   npx wrangler d1 execute kinetiq-db --local --file=seed-fo-intelligence.sql

INSERT INTO projects (
  slug,
  title,
  category,
  tags,
  summary,
  thumbnail,
  images,
  year,
  featured,
  challenge,
  solution,
  result,
  metrics,
  quote,
  sort_order,
  created_at,
  updated_at
) VALUES (
  'fo-intelligence',
  'Family Offices Intelligence',
  'AI Automation',
  '["Data Pipeline","AI Web Scraping","GPT-4o Extraction","Qdrant Vector DB","FastAPI","RAG Engine","Entity Resolution"]',
  'An automated end-to-end intelligence and enrichment pipeline that discovers, crawls, enriches, scores, and indexes Family Office records into a high-performance vector database served through a natural-language RAG interface.',
  '/fo-intelligence/pipeline_workflow.jpg',
  '["/fo-intelligence/system_architecture.jpg","/fo-intelligence/pipeline_workflow.jpg"]',
  '2026',
  1,
  'Family offices manage trillions in private wealth but operate under strict privacy with fragmented, non-standardized web presences. Building a high-confidence dataset requires bypassing anti-scraping protections, parsing unstructured multi-page websites, inferring verified contact points without spamming, and eliminating low-quality data.',
  'FO Intelligence builds a 6-stage automated intelligence pipeline: (1) Structured directory scraping, (2) Stealth headless Chromium crawling with Cloudflare bypass (Crawl4AI), (3) Dual-agent GPT-4o-mini entity & contact extraction, (4) Contact discovery via Tavily and MX-level domain validation, (5) 5-dimension automated quality scoring selecting the top 50 records, and (6) OpenAI 1536d vector embedding into Qdrant Cloud connected to a FastAPI RAG search engine and React Explorer interface.',
  'A production-grade, scored, and queryable intelligence platform covering 50 institutional family offices with 30 validated attributes per entity, complete contact inference, full provenance tracking, and sub-second natural language RAG search.',
  '[{"value":"30","label":"structured attributes per FO"},{"value":"6-Stage","label":"automated intelligence pipeline"},{"value":"1536d","label":"vector embeddings in Qdrant"},{"value":"100%","label":"MX domain verification"}]',
  NULL,
  5,
  datetime('now'),
  datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET
  title      = excluded.title,
  category   = excluded.category,
  tags       = excluded.tags,
  summary    = excluded.summary,
  thumbnail  = excluded.thumbnail,
  images     = excluded.images,
  year       = excluded.year,
  featured   = excluded.featured,
  challenge  = excluded.challenge,
  solution   = excluded.solution,
  result     = excluded.result,
  metrics    = excluded.metrics,
  sort_order = excluded.sort_order,
  updated_at = datetime('now');

