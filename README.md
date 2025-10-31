This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and integrated with [Supabase](https://supabase.com) for authentication, database, and file storage.

## Configuration

### 1. Environment Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SUPABASE_SECRET_KEY=your_secret_key
   ```

   > ⚠️ Never commit `.env.local` to version control!

### 2. Database Setup

1. Create your Supabase project at [supabase.com](https://supabase.com)
2. Apply the database migrations:
   ```bash
   cd supabase/migrations
   psql -h your-project.supabase.co -U postgres -f 00001_init.sql
   ```
   Or use the Supabase Dashboard SQL Editor to run the migration.

### 3. Dependencies

Install the required dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authentication

The project uses role-based authentication with three types of admin users:

- **super_admin**: Full access to all features
- **content_manager**: Can manage blog posts and projects
- **messages_manager**: Can manage contact form submissions

To log in, visit `/admin/login`. Only authenticated users with appropriate roles can access the admin dashboard.

### Example Usage

```javascript
// Client-side authentication
import supabase from '@/utils/supabase/client'

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@example.com',
  password: 'secure-password'
})

// Get user session
const { data: { session } } = await supabase.auth.getSession()
const userRole = session?.user?.user_metadata?.role

// Protected API route
import { getSupabaseFromRequest } from '@/utils/supabase/middleware'

export async function GET(req) {
  const { supabase, token } = getSupabaseFromRequest(req)
  if (token) {
    const { data } = await supabase.from('projects').select()
    return Response.json({ data })
  }
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
