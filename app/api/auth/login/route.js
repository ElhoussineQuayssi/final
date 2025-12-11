import { NextResponse } from 'next/server';
import { AuthController } from '../../../../lib/controllers/auth';

export async function POST(request) {
  console.log('Login API route called');
  try {
    const body = await request.json();
    console.log('Login request body:', { email: body.email, password: '[REDACTED]' });
    const result = await AuthController.login(body);
    console.log('Login successful for user:', result.user.email);
    return NextResponse.json(result);
  } catch (err) {
    console.error('Error logging in:', err.message);
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}