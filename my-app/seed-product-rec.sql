-- Product Recommendation Engine — project insert / update
-- Run against production D1:
--   npx wrangler d1 execute kinetiq-db --remote --file=seed-product-rec.sql
-- Run against local D1:
--   npx wrangler d1 execute kinetiq-db --local --file=seed-product-rec.sql

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
  'product-recommendation-engine',
  'Product Recommendation Engine',
  'AI Automation',
  '["Recommendation Systems","FAISS Vector Search","Sentence-Transformers","FastAPI","Scikit-learn","Machine Learning","E-commerce AI"]',
  'A high-throughput, two-stage hybrid recommendation engine combining collaborative filtering with dense semantic embeddings to deliver real-time personalized product suggestions under 25ms.',
  '/product-recommendation-engine/pipeline_workflow.jpg',
  '["/product-recommendation-engine/system_architecture.jpg","/product-recommendation-engine/pipeline_workflow.jpg"]',
  '2026',
  1,
  'E-commerce platforms face severe cold-start problems and latency bottlenecks when scaling recommendations across catalogs with 100,000+ SKUs. Pure collaborative filtering fails on new items without historical interactions, while pure content-based search lacks behavioral nuance and collaborative signals. Serving real-time personalized recommendations at sub-25ms P99 latency during peak shopping spikes requires a scalable dual-retrieval and re-ranking architecture.',
  'We architected a high-throughput, two-stage hybrid recommendation engine. Stage 1 executes parallel candidate retrieval: dense semantic item similarity using Sentence-Transformers (all-MiniLM-L6-v2, 384d) indexed with FAISS for sub-millisecond nearest neighbor search, paired with Scikit-learn item-based collaborative filtering matrix co-occurrence. Stage 2 passes candidates to a LightGBM gradient-boosted re-ranking model trained on user session context, price sensitivity, and conversion probabilities, with real-time business rule filtering (in-stock checks, category diversity, and deduplication). The service is exposed via an asynchronous FastAPI microservice containerized with Docker.',
  'Delivered a 28% increase in Click-Through Rate (CTR) and an 18% lift in Average Order Value (AOV) across an active catalog of 100,000+ SKUs. Maintained a sub-25ms P99 response time under heavy concurrent traffic loads, eliminating cold-start degradation for newly listed merchandise.',
  '[{"value":"<25ms","label":"P99 API Inference Latency"},{"value":"+28%","label":"Click-Through Rate (CTR) Lift"},{"value":"+18%","label":"Average Order Value (AOV)"},{"value":"100k+","label":"Indexed Product Catalog SKUs"}]',
  NULL,
  3,
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

