-- Kinetiq Admin Database Schema (Cloudflare D1 / SQLite)
-- Run: wrangler d1 execute kinetiq-db --file=schema.sql

-- Projects (replaces src/data/work.ts)
CREATE TABLE IF NOT EXISTS projects (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  slug       TEXT UNIQUE NOT NULL,
  title      TEXT NOT NULL,
  category   TEXT NOT NULL CHECK (category IN ('AI Automation', 'Web Development', 'Generative AI')),
  tags       TEXT NOT NULL DEFAULT '[]',
  summary    TEXT NOT NULL,
  thumbnail  TEXT NOT NULL,
  images     TEXT NOT NULL DEFAULT '[]',
  year       TEXT NOT NULL,
  featured   INTEGER NOT NULL DEFAULT 0,
  challenge  TEXT NOT NULL DEFAULT '',
  solution   TEXT NOT NULL DEFAULT '',
  result     TEXT NOT NULL DEFAULT '',
  metrics    TEXT NOT NULL DEFAULT '[]',
  quote      TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Blogs (replaces src/data/blog.ts + public/blogs/*.txt)
CREATE TABLE IF NOT EXISTS blogs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  slug       TEXT UNIQUE NOT NULL,
  title      TEXT NOT NULL,
  excerpt    TEXT NOT NULL DEFAULT '',
  category   TEXT NOT NULL CHECK (category IN ('Company', 'Robotics', 'Computer Vision', 'Drones')),
  date       TEXT NOT NULL,
  read_time  INTEGER NOT NULL DEFAULT 3,
  content    TEXT NOT NULL DEFAULT '',
  published  INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Project RAG documents (metadata — files live in R2)
CREATE TABLE IF NOT EXISTS project_documents (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id  INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  filename    TEXT NOT NULL,
  r2_key      TEXT NOT NULL,
  size_bytes  INTEGER NOT NULL DEFAULT 0,
  uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Admin sessions (simple token auth)
CREATE TABLE IF NOT EXISTS admin_sessions (
  token      TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published, date);
CREATE INDEX IF NOT EXISTS idx_project_documents_project ON project_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
