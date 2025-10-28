import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseFromRequest } from '@/utils/supabase/middleware';

export async function GET(req) {
  try {
    // Test 1: Environment Variables
    const envTest = {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    };

    // Test 2: Supabase Client Initialization
    const { supabase, token } = getSupabaseFromRequest(req);
    
    // Test 3: JWT Role Extraction (if authenticated)
    let roleTest = { hasToken: !!token };
    if (token) {
      try {
        const { data: { user } } = await supabase.auth.getUser(token);
        roleTest.user = {
          id: user?.id,
          email: user?.email,
          role: user?.user_metadata?.role,
        };
      } catch (e) {
        roleTest.error = 'Invalid token';
      }
    }

    // Test 4: Database Query (public access)
    const { data: projects, error: projectError } = await supabase
      .from('projects')
      .select('id, title')
      .limit(1);

    return Response.json({
      status: 'ok',
      tests: {
        environment: envTest,
        authentication: roleTest,
        database: {
          canQuery: !projectError,
          error: projectError?.message,
          hasProjects: Array.isArray(projects),
        }
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({ 
      status: 'error',
      message: error.message 
    }, { status: 500 });
  }
}