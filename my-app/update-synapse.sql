-- Synapse — full project details update
-- Run against production D1:
--   npx wrangler d1 execute kinetiq-db --remote --file=update-synapse.sql
-- Run against local D1:
--   npx wrangler d1 execute kinetiq-db --local --file=update-synapse.sql

UPDATE projects SET
  title      = 'Synapse',
  category   = 'Generative AI',
  tags       = '["Multi-Agent RAG","Document AI","Agentic Retrieval","FastAPI","Next.js","Cloudflare Workers","pgvector","GPU Pipeline"]',
  summary    = 'A full-stack, multi-tenant platform that turns document libraries into a production-grade research assistant — with agentic retrieval, layout-aware ingestion, inline figures, and chunk-level citations. Built solo, end to end: edge frontend, GPU backend, durable job queue, and a six-stage multi-agent RAG brain.',
  thumbnail  = '/synapse/1.PNG',
  images     = '["/synapse/1.PNG","/synapse/2.PNG","/synapse/3.PNG","/synapse/system_architecture.jpg","/synapse/pipeline_architecture.jpg"]',
  year       = '2025',
  featured   = 1,
  challenge  = 'Most "chat with PDF" tools are a single embedding lookup followed by a context paste — they fail on comparison questions, miss entities spread across documents, and give answers with no way to verify the source. Building a system that is genuinely accurate on hard research questions meant solving four separate problems at once: understanding document layout (tables, figures, formulas, not just text), retrieving evidence adaptively based on question type, knowing when the evidence is complete enough to answer, and surfacing that reasoning as verifiable, source-anchored citations with the actual figures embedded inline.',
  solution   = 'Synapse is split into three planes: a Cloudflare Workers edge frontend (Next.js 16/React 19), a GPU backend (FastAPI + PyTorch on GCP L4), and shared state (Supabase Postgres + pgvector + R2). The document ingestion pipeline is a resumable, multi-stage job queue with seven worker stages: sync → layout detection (DocLayout-YOLO) → text extraction + OCR (Surya) → figure/table captioning (Qwen2-VL) → context-aware chunking with visual links → embedding (BGE-large-en-v1.5, 1024d) → semantic clustering. The chat layer is a six-stage agentic orchestrator: a Planner classifies each query into one of six query classes (spotlight, multi-hop, comparison, aggregation, multi-entity, conversational) and decomposes it into sub-questions; a parallel Retriever fans out pgvector cosine search + lexical fallback + cross-encoder reranking + neighbor-chunk expansion; an Extractor distills retrieved chunks into a source-anchored evidence brief; a bounded Curiosity Loop generates bridging follow-up questions and stops early when evidence is sufficient; a Completeness Critic detects missing entities and gap-fills; and a Synthesizer formats the final answer with [[CITE:n]] and [[VISUAL:id]] markers that render as citation chips and inline figure cards in the UI.',
  result     = 'A production-grade, fully operational platform supporting multi-tenant organizations, per-library sharing, team collaboration with cross-organization pooled knowledge bases, and email invites. The agentic pipeline handles all six query classes with three configurable thinking modes (Fast/Balanced/Deep) trading latency for reasoning depth. Every answer is grounded in the source documents, links back to the exact chunks used, and can embed the relevant figures and tables inline in the response. The evaluation harness reproduces DOUBLE-BENCH methodology on the real pipeline — hit@k retrieval scoring, LLM-as-judge answer accuracy, RAGAS, citation accuracy, honesty/overconfidence, and latency metrics with a hard cost budget.',
  metrics    = '[{"value":"6","label":"agentic pipeline stages"},{"value":"7","label":"GPU ingestion worker stages"},{"value":"3","label":"thinking modes (Fast / Balanced / Deep)"},{"value":"1","label":"GPU (GCP L4) for full ingestion + chat"}]',
  quote      = NULL,
  sort_order = 1,
  updated_at = datetime('now')
WHERE slug = 'synapse';
