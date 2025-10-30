-- Drop the old table if needed (be careful with existing data)
-- DROP TABLE public.admins;

-- 1. Re-create the admins table correctly
CREATE TABLE IF NOT EXISTS public.admins (
  -- This ID is now the PRIMARY KEY and a FOREIGN KEY to auth.users
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Your existing metadata columns are perfect here
  name TEXT NOT NULL,
  role admin_role NOT NULL,
  last_login TIMESTAMPTZ,

  -- No password, email, failed_attempts, locked_until, etc.
  -- The email is stored in auth.users and is guaranteed to be unique.

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Re-create the index on the role for faster lookups if you need it
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);

-- Enable RLS on the new admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Update the policy for the admins table
DROP POLICY IF EXISTS "Admins can manage admin data based on role" ON admins;
CREATE POLICY "Admins can manage admin data based on role" ON admins
  FOR ALL USING (
    (get_my_role() = 'super_admin') OR (id = auth.uid())
  ) WITH CHECK (
    (get_my_role() = 'super_admin') OR (id = auth.uid())
  );