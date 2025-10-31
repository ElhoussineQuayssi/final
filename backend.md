This is a comprehensive guide to building the core backend for your Next.js project using Supabase. It covers setting up your database schema, managing project images with Supabase Storage, implementing security rules, and creating API endpoints in Next.js to handle the backend logic.

### **Part 1: Supabase Project Setup**

Before you begin, make sure you have a Supabase account.

1.  **Create a New Project**:
    *   Navigate to your [Supabase Dashboard](https://database.new).
    *   Click on "New Project" and give it a name.
    *   Choose a strong, memorable password for your database and save it securely.
    *   Select a region that is geographically close to your users.
    *   It will take a couple of minutes for your new project to be provisioned.

2.  **Get Your API Keys**:
    *   Once your project is ready, go to the "Project Settings" (the gear icon in the left sidebar).
    *   Click on the "API" tab.
    *   You will need the **Project URL** and the `anon` **public** key. These will be used in your Next.js application to connect to Supabase. Keep them safe.

### **Part 2: Database Schema and Image Table**

This section details how to set up your database tables, including a new `project_images` table to handle multiple images per project.

1.  **Navigate to the SQL Editor**:
    *   In your Supabase project dashboard, click on the "SQL Editor" icon (it looks like a database with a query symbol).
    *   Click on "New query".

2.  **Execute the Full SQL Schema**:
    *   Copy the entire SQL script below. This includes your original schema plus the new `project_images` table and its necessary relationships.
    *   Paste the script into the SQL Editor and click "**RUN**".

```sql
-- =========SCHEMA CREATION=========

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  failed_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  last_login TIMESTAMPTZ,
  last_password_change TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
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
  published_at TIMESTAMPTZ
);

-- Messages table
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

-- Projects table
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

-- NEW: Project Images table
CREATE TABLE IF NOT EXISTS project_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site configuration table
CREATE TABLE IF NOT EXISTS site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========INDEXES=========
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
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
-- NEW: Index for project_images
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);

```

**Explanation of the New Table**:

*   **`project_images`**: This table is designed to store references to multiple images for each project.
*   **`project_id`**: This is a foreign key that links each image to a specific project in the `projects` table.
*   **`ON DELETE CASCADE`**: This is a crucial constraint. It ensures that if a project is deleted from the `projects` table, all of its associated image records in `project_images` are automatically deleted, preventing orphaned data.

### **Part 3: Row Level Security (RLS)**

RLS is a powerful PostgreSQL feature that controls which user can access which rows of data. It's essential for security.

1.  **Go Back to the SQL Editor**.
2.  **Execute the RLS Policies**:
    *   Copy the entire SQL script below, which includes policies for the new `project_images` table.
    *   Paste it into a new query and click "**RUN**".

```sql
-- =========ROW LEVEL SECURITY (RLS)=========

-- Enable RLS on all tables
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
-- NEW: Enable RLS on project_images
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- --- POLICIES ---

-- Admins: only authenticated admins can access
CREATE POLICY "Admins can access their own data" ON admins
  FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- Blog posts: public read, admin write
CREATE POLICY "Anyone can read blog posts" ON blog_posts
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage blog posts" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- Messages: admin read/write, public insert
CREATE POLICY "Anyone can create messages" ON messages
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage messages" ON messages
  FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- Projects: public read, admin write
CREATE POLICY "Anyone can read projects" ON projects
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- NEW: Project Images: public read, admin write
CREATE POLICY "Anyone can read project images" ON project_images
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage project images" ON project_images
  FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- Site config: public read, admin write
CREATE POLICY "Anyone can read site config" ON site_config
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage site config" ON site_config
  FOR ALL USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');
```

### **Part 4: Supabase Storage for Images**

Here, you'll set up a dedicated "bucket" to store your image files.

1.  **Navigate to Storage**:
    *   In the Supabase dashboard, click the "Storage" icon in the sidebar.

2.  **Create a New Bucket**:
    *   Click "**Create a new bucket**".
    *   Name the bucket `project_images`.
    *   **Important**: Keep the bucket **private**. We will control access via security policies, not by making it public.

3.  **Set Up Storage Policies**:
    *   After creating the bucket, click on its name to view its policies.
    *   We need two policies: one for public read access and one for admin write access.
    *   Click "**New Policy**" and create the following:

        *   **Policy 1: Allow Public Read Access**
            *   **Policy Name**: `Public Read Access`
            *   **Allowed operations**: `SELECT`
            *   **Policy definition**:
                ```sql
                (bucket_id = 'project_images')
                ```

        *   **Policy 2: Allow Admins to Upload/Delete**
            *   **Policy Name**: `Admin Write Access`
            *   **Allowed operations**: `INSERT`, `UPDATE`, `DELETE`
            *   **Policy definition**:
                ```sql
                (bucket_id = 'project_images' AND auth.role() = 'authenticated' AND (auth.jwt() ->> 'role') = 'admin')
                ```

### **Part 5: Connecting Next.js to Supabase**

Now, let's integrate the Supabase client into your Next.js project.

1.  **Install Supabase Libraries**:
    ```bash
    npm install @supabase/supabase-js @supabase/ssr
    ```

2.  **Set Up Environment Variables**:
    *   Create a file named `.env.local` in the root of your Next.js project.
    *   Add your Supabase URL and `anon` key to this file.
    ```
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

3.  **Create Supabase Clients**:
    To interact with Supabase from both client and server components, you need to set up different clients.

    *   Create a file at `utils/supabase/client.ts`:
        ```typescript
        // utils/supabase/client.ts
        import { createBrowserClient } from '@supabase/ssr'

        export function createClient() {
          return createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          )
        }
        ```

    *   Create a file at `utils/supabase/server.ts`:
        ```typescript
        // utils/supabase/server.ts
        import { createServerClient, type CookieOptions } from '@supabase/ssr'
        import { cookies } from 'next/headers'

        export function createClient(cookieStore: ReturnType<typeof cookies>) {
          return createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
              cookies: {
                get(name: string) {
                  return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                  cookieStore.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                  cookieStore.set({ name, value: '', ...options })
                },
              },
            }
          )
        }
        ```

### **Part 6: Core API Route Logic (Example)**

The final step is to build the API endpoints in your Next.js `app/api` directory to handle requests from your frontend. Here is a conceptual example for managing projects and their images.

#### **Fetching a Project with its Images**

This endpoint retrieves a single project and its associated images.

`app/api/projects/[slug]/route.ts`:
```typescript
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { slug } = params;

  // Fetch project details
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (projectError) {
    return NextResponse.json({ error: projectError.message }, { status: 404 });
  }

  // Fetch associated images
  const { data: images, error: imagesError } = await supabase
    .from('project_images')
    .select('image_url, alt_text')
    .eq('project_id', project.id);

  if (imagesError) {
    // You might want to handle this error differently, but for now we'll log it
    console.error('Error fetching images:', imagesError.message);
  }

  // Combine and return the data
  const responseData = {
    ...project,
    gallery_images: images || [], // Ensure gallery_images is always an array
  };

  return NextResponse.json(responseData);
}
```

#### **Creating a Project with Image Uploads**

This is a more complex operation that involves handling file uploads to Supabase Storage and then creating records in your database. This would typically be called from an admin dashboard.

**Note**: This example assumes you are sending `FormData` from the client.

`app/api/projects/route.ts`:
```typescript
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // First, check if the user is an authenticated admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // This part assumes you store a role in the user's metadata upon signup
  // Or you could join with an 'admins' table
  // For simplicity, we are skipping the role check here but it's crucial for production.

  const formData = await request.formData();
  const projectData = JSON.parse(formData.get('projectData') as string);
  const files = formData.getAll('images') as File[];

  // 1. Insert the main project data
  const { data: newProject, error: projectError } = await supabase
    .from('projects')
    .insert({
      id: projectData.id, // Assuming ID is generated client-side or based on title
      slug: projectData.slug,
      title: projectData.title,
      // ...other project fields
    })
    .select()
    .single();

  if (projectError) {
    return NextResponse.json({ error: projectError.message }, { status: 500 });
  }

  // 2. Upload images to Supabase Storage
  for (const file of files) {
    const filePath = `${newProject.id}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('project_images') // Bucket name
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload Error:', uploadError.message);
      // If one upload fails, you might want to roll back the project creation
      continue; // Continue to next file for simplicity here
    }

    // 3. Get the public URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('project_images')
      .getPublicUrl(filePath);

    // 4. Insert image reference into the 'project_images' table
    if (publicUrl) {
      await supabase.from('project_images').insert({
        project_id: newProject.id,
        image_url: publicUrl,
        alt_text: file.name, // Or get alt text from form data
      });
    }
  }

  return NextResponse.json(newProject, { status: 201 });
}
```

This guide provides the complete foundation for your project's backend. From here, you can continue to build out more complex API routes for updating, deleting, and managing all aspects of your application data.