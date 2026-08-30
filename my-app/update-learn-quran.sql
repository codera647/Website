-- Learn Quran Global — full project details update
-- Run against production D1:
--   npx wrangler d1 execute kinetiq-db --remote --file=update-learn-quran.sql
-- Run against local D1:
--   npx wrangler d1 execute kinetiq-db --local --file=update-learn-quran.sql

UPDATE projects SET
  title      = 'Learn Quran Global',
  category   = 'Web Development',
  tags       = '["Next.js 15","React 19","Supabase","PostgreSQL RLS","LMS Platform","Three.js","Tailwind CSS 4","Framer Motion"]',
  summary    = 'A full-stack learning management and marketing platform for an international online Quran academy, featuring interactive 3D graphics, multi-country landing pages, and role-based student, teacher, and admin portals backed by Supabase with Row Level Security.',
  thumbnail  = '/learn-quran-global/main_mockup.png',
  images     = '["/learn-quran-global/main_mockup.png","/learn-quran-global/laptop_mockup.png","/learn-quran-global/calender_mockup.png","/learn-quran-global/system_architecture.jpg"]',
  year       = '2025',
  featured   = 1,
  challenge  = 'Online educational platforms frequently suffer from clunky, fragmented user experiences: separate disconnected marketing funnels, high bounce rates, and unintuitive scheduling systems for students across multiple international timezones. Building Learn Quran Global required delivering high-performance marketing conversion with interactive 3D visuals while managing secure, multi-tenant learning portals for students, teachers, and administrators under strict data privacy.',
  solution   = 'We architected a unified platform powered by Next.js 15 App Router, React 19, and Tailwind CSS 4. The public experience features interactive Three.js 3D hero canvasing, dynamic location-based SEO landing pages, and automated syllabus exploration. Behind authentication, the platform provides dedicated role-based portals (Students track schedules, progress, and messages; Teachers manage assigned classes and student attendance; Admins oversee enrollments, curriculum, and analytics). The data layer leverages Supabase PostgreSQL with rigorous Row Level Security (RLS) policies and middleware session hydration.',
  result     = 'A live, production platform deployed at learnquranglobal.org serving international students across the US, UK, Canada, and Australia. Accelerated student onboarding velocity, eliminated manual timezone scheduling friction, and achieved high Lighthouse performance scores with instant page loads.',
  metrics    = '[{"value":"3 Roles","label":"Student, Teacher & Admin Portals"},{"value":"100%","label":"Row Level Security (RLS) Coverage"},{"value":"Multi-Region","label":"International Timezone Scheduling"},{"value":"Next.js 15","label":"App Router & React 19 Engine"}]',
  quote      = NULL,
  sort_order = 2,
  updated_at = datetime('now')
WHERE slug = 'learn-quran-global';

