--
-- CORE BACKEND SCHEMA FOR NEXT.JS PROJECT WITH SUPABASE
--
-- Version: 2.1 (with Role-Based Access Control and Column Hotfix)
-- This script is idempotent and robust. It can be run multiple times safely.
--

-- =================================================================
-- 1. EXTENSIONS
-- =================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- =================================================================
-- 2. CUSTOM TYPES
-- =================================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_role') THEN
        CREATE TYPE admin_role AS ENUM ('super_admin', 'content_manager', 'messages_manager');
    END IF;
END$$;


-- =================================================================
-- 3. TABLE DEFINITIONS
-- =================================================================

CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role admin_role NOT NULL,
  failed_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  last_login TIMESTAMPTZ,
  last_password_change TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  share_on_social BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ -- Definition is here
);

-- ***************************************************************
-- *** FIX: ADD THE published_at COLUMN IF IT DOES NOT EXIST ***
-- This command ensures the column exists before indexes are created.
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
-- ***************************************************************

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'contact',
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  image TEXT,
  categories JSONB NOT NULL DEFAULT '[]'::jsonb,
  start_date TEXT,
  location TEXT,
  people_helped TEXT,
  status TEXT DEFAULT 'Actif',
  content JSONB DEFAULT '[]'::jsonb,
  goals JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =================================================================
-- 4. INDEXES FOR PERFORMANCE
-- =================================================================
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_created_at_id ON projects(created_at DESC, id);
CREATE INDEX IF NOT EXISTS idx_projects_status_created_at ON projects(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);


-- =================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =================================================================

-- Enable RLS on all tables
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- Helper function to extract the role from the JWT claims
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT (auth.jwt() ->> 'app_metadata')::jsonb ->> 'role'
$$ LANGUAGE sql STABLE;

-- Drop existing policies to avoid conflicts before creating new ones
DROP POLICY IF EXISTS "Admins can manage admin data based on role" ON admins;
DROP POLICY IF EXISTS "Anyone can read blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Content managers can manage blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Anyone can create messages" ON messages;
DROP POLICY IF EXISTS "Message managers can manage messages" ON messages;
DROP POLICY IF EXISTS "Anyone can read projects" ON projects;
DROP POLICY IF EXISTS "Content managers can manage projects" ON projects;
DROP POLICY IF EXISTS "Anyone can read project images" ON project_images;
DROP POLICY IF EXISTS "Content managers can manage project images" ON project_images;
DROP POLICY IF EXISTS "Anyone can read site config" ON site_config;
DROP POLICY IF EXISTS "Super admins can manage site config" ON site_config;

-- --- New Role-Based Policy Definitions ---

-- Admins table: Super admins can manage all admins. Others can only view/edit their own profile.
CREATE POLICY "Admins can manage admin data based on role" ON admins
  FOR ALL USING (
    (get_my_role() = 'super_admin') OR (id = auth.uid())
  ) WITH CHECK (
    (get_my_role() = 'super_admin') OR (id = auth.uid())
  );

-- Blog posts table: Public can read. Super admins and content managers can write.
CREATE POLICY "Anyone can read blog posts" ON blog_posts
  FOR SELECT USING (true);
CREATE POLICY "Content managers can manage blog posts" ON blog_posts
  FOR ALL USING (get_my_role() IN ('super_admin', 'content_manager'));

-- Messages table: Anyone can insert. Super admins and message managers can read/write.
CREATE POLICY "Anyone can create messages" ON messages
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Message managers can manage messages" ON messages
  FOR ALL USING (get_my_role() IN ('super_admin', 'messages_manager'));

-- Projects table: Public can read. Super admins and content managers can write.
CREATE POLICY "Anyone can read projects" ON projects
  FOR SELECT USING (true);
CREATE POLICY "Content managers can manage projects" ON projects
  FOR ALL USING (get_my_role() IN ('super_admin', 'content_manager'));

-- Project Images table: Public can read. Super admins and content managers can write.
CREATE POLICY "Anyone can read project images" ON project_images
  FOR SELECT USING (true);
CREATE POLICY "Content managers can manage project images" ON project_images
  FOR ALL USING (get_my_role() IN ('super_admin', 'content_manager'));

-- Site config table: Public can read. ONLY super admins can write.
CREATE POLICY "Anyone can read site config" ON site_config
  FOR SELECT USING (true);
CREATE POLICY "Super admins can manage site config" ON site_config
  FOR ALL USING (get_my_role() = 'super_admin');