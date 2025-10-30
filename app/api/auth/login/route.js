import { NextResponse } from 'next/server';
import { AuthController } from '../../../../lib/controllers/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await AuthController.login(body);
    return NextResponse.json(result);
  } catch (err) {
    console.error('Error logging in:', err.message);
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}