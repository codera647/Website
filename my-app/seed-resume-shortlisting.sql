-- Resume Shortlisting Platform — project insert / update
-- Run against production D1:
--   npx wrangler d1 execute kinetiq-db --remote --file=seed-resume-shortlisting.sql
-- Run against local D1:
--   npx wrangler d1 execute kinetiq-db --local --file=seed-resume-shortlisting.sql

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
  'resume-shortlisting-platform',
  'Resume Shortlisting Platform',
  'AI Automation',
  '["RAG & LLM Evaluation","Mistral LLM","Weaviate Vector DB","KMeans Clustering","React","Flask","HR Tech AI"]',
  'An automated bulk-resume screener and intelligence platform that ranks thousands of candidate profiles against complex job descriptions using hybrid RAG, KMeans clustering, and Mistral LLM rubric scoring with instant Excel exports.',
  '/resume-shortlisting-platform/pipeline_workflow.jpg',
  '["/resume-shortlisting-platform/system_architecture.jpg","/resume-shortlisting-platform/pipeline_workflow.jpg"]',
  '2026',
  1,
  'Technical recruiting teams are overwhelmed by high-volume job applications, reviewing thousands of resumes per opening while missing top talent due to keyword-only filters and manual fatigue. Traditional Applicant Tracking Systems (ATS) rely on brittle keyword matching that rejects qualified candidates and fails to evaluate qualitative skill depth, domain alignment, or contextual project experience.',
  'We engineered an end-to-end automated screening platform powered by a React UI and Flask microservices. Resumes (PDF, DOCX, RTF) are ingested, parsed, and indexed in Weaviate using hybrid search (dense semantic vector embeddings combined with BM25 keyword matching) to match candidate accomplishments against job requirements. An unsupervised KMeans clustering engine groups applicant skill vectors into talent cohorts and seniority tiers. Mistral LLM evaluates candidates against customized multi-criteria rubrics (Technical Competency, Experience Depth, Domain Relevancy, and Education), outputting detailed quantitative scores, qualitative rationale, and structured color-coded Excel (.xlsx) exports.',
  'Reduced initial recruiter screening time by 85% while scaling processing throughput to 5,000+ resumes per batch. Achieved a 94% score alignment with senior hiring manager evaluations and delivered sub-second candidate ranking and reporting.',
  '[{"value":"85%","label":"Recruiter Screening Time Saved"},{"value":"5,000+","label":"Resumes Processed / Batch"},{"value":"94%","label":"Hiring Manager Score Alignment"},{"value":"Sub-Second","label":"Automated Excel Export"}]',
  NULL,
  6,
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

