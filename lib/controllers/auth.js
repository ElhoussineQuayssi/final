import supabaseServer from '../supabaseServer';

export class AuthController {
  static async login(credentials) {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const { data: authData, error: authError } = await supabaseServer.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      throw new Error('Invalid credentials');
    }

    // Check if user is an admin
    const { data: adminData, error: adminError } = await supabaseServer
      .from('admins')
      .select('name, role')
      .eq('id', authData.user.id)
      .single();

    if (adminError || !adminData) {
      // Sign out the user since they're not an admin
      await supabaseServer.auth.signOut();
      throw new Error('Access denied');
    }

    // Update last login
    await supabaseServer
      .from('admins')
      .update({ last_login: new Date().toISOString() })
      .eq('id', authData.user.id);

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
    console.log('Debug: getCurrentUser called with user:', user.id, user.email);
    console.log('Debug: supabaseServer defined?', !!supabaseServer);

    const { data: adminData, error: adminError } = await supabaseServer
      .from('admins')
      .select('name, role, last_login, created_at')
      .eq('id', user.id)
      .single();

    console.log('Debug: admins query result - data:', adminData, 'error:', adminError);

    if (adminError || !adminData) {
      console.log('Debug: Admin check failed - throwing error');
      throw new Error('Not an admin user');
    }

    console.log('Debug: Admin user found, returning data');
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