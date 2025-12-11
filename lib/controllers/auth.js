import supabaseServer from '../supabaseServer';

export class AuthController {
  static async login(credentials) {
    console.log('AuthController.login called with credentials:', { email: credentials.email, password: '[REDACTED]' });
    const { email, password } = credentials;

    if (!email || !password) {
      console.log('Missing email or password');
      throw new Error('Email and password are required');
    }

    console.log('Attempting Supabase sign in');
    const { data: authData, error: authError } = await supabaseServer.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.log('Supabase auth error:', authError);
      throw new Error('Invalid credentials');
    }

    console.log('Supabase auth successful, checking admin status');
    // Check if user is an admin
    const { data: adminData, error: adminError } = await supabaseServer
      .from('admins')
      .select('name, role')
      .eq('id', authData.user.id)
      .single();

    if (adminError || !adminData) {
      console.log('Admin check failed:', adminError);
      // Sign out the user since they're not an admin
      await supabaseServer.auth.signOut();
      throw new Error('Access denied');
    }

    console.log('Admin check passed, updating last login');
    // Update last login
    await supabaseServer
      .from('admins')
      .update({ last_login: new Date().toISOString() })
      .eq('id', authData.user.id);

    console.log('Login process completed successfully');
    return {
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: adminData.name,
        role: adminData.role,
      },
      session: authData.session,
    };
  }

  static async logout() {
    const { error } = await supabaseServer.auth.signOut();

    if (error) {
      throw new Error('Failed to logout');
    }

    return { message: 'Logged out successfully' };
  }

  static async getCurrentUser(user) {
    const { data: adminData, error: adminError } = await supabaseServer
      .from('admins')
      .select('name, role, last_login, created_at')
      .eq('id', user.id)
      .single();

    if (adminError || !adminData) {
      throw new Error('Not an admin user');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: adminData.name,
        role: adminData.role,
        last_login: adminData.last_login,
        created_at: adminData.created_at,
      },
    };
  }
}