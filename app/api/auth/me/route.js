import { NextResponse } from 'next/server';
import { AuthController } from '@/lib/controllers/auth';
import supabaseServer from '@/lib/supabaseServer';

export async function GET(request) {
  try {
    console.log('Debug: Starting GET /api/auth/me');
    console.log('Debug: supabaseServer defined?', !!supabaseServer);

    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    console.log('Debug: auth.getUser result - user:', user, 'error:', authError);

    if (authError || !user) {
      console.log('Debug: No user or auth error, returning 401');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    console.log('Debug: Calling AuthController.getCurrentUser with user:', user.id);
    const result = await AuthController.getCurrentUser(user);
    console.log('Debug: getCurrentUser result:', result);
    return NextResponse.json(result);
  } catch (err) {
    console.error('Error fetching current user:', err.message);
    console.error('Debug: Full error stack:', err.stack);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}