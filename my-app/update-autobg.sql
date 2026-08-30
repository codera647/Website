-- AutoBG — full project details update
-- Run against production D1:
--   npx wrangler d1 execute kinetiq-db --remote --file=update-autobg.sql
-- Run against local D1:
--   npx wrangler d1 execute kinetiq-db --local --file=update-autobg.sql

UPDATE projects SET
  title      = 'AutoBG',
  category   = 'Generative AI',
  tags       = '["AI Background Removal","BiRefNet HR","SDXL Inpainting","Computer Vision","FastAPI","PyTorch CUDA","Studio Compositing"]',
  summary    = 'A full-stack generative AI platform that transforms raw vehicle photos into dealership-grade studio composites with continuous alpha matting, AI reflection inpainting, ambient bounce relighting, and physically grounded shadows.',
  thumbnail  = '/autobg/pipeline_flow.jpg',
  images     = '["/autobg/system_architecture.jpg","/autobg/pipeline_flow.jpg"]',
  year       = '2026',
  featured   = 1,
  challenge  = 'Commercial automotive photography typically demands dedicated turntable studios that cost thousands per vehicle shoot. Standard background removal tools output jagged binary masks, destroy fine wheel spoke details, leave harsh colored edge halos, and fail to harmonize studio lighting, realistic floor contact shadows, and mirror reflections.',
  solution   = 'AutoBG combines high-resolution deep learning segmentation with diffusion inpainting and deterministic computer vision compositing. It runs BiRefNet HR on CUDA at 2048x2048 to generate sub-pixel continuous alpha mattes, followed by PyMatting FBA edge decontamination to eliminate edge halos. Lighting harmonization applies white-balance shifts and ambient floor bounce relighting. Stable Diffusion XL with ControlNet inpaints photorealistic mirror floor reflections, while a 1-point perspective studio plate generator synthesizes multi-layer contact and ambient shadows with cinematic film grain.',
  result     = 'A single-call GPU pipeline that outputs showroom-ready vehicle photography in seconds. Operates efficiently on an NVIDIA L4 GPU with low VRAM footprint (~2GB for BiRefNet, ~8GB for SDXL ControlNet), delivering studio-quality marketing assets at scale for automotive retailers and marketplaces.',
  metrics    = '[{"value":"2048px","label":"BiRefNet HR continuous alpha"},{"value":"~2s","label":"matting & compositing latency"},{"value":"100%","label":"dealership studio fidelity"},{"value":"1 GPU","label":"NVIDIA L4 hardware footprint"}]',
  quote      = NULL,
  sort_order = 4,
  updated_at = datetime('now')
WHERE slug = 'autobg';

