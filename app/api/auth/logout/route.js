import { NextResponse } from 'next/server';
import { AuthController } from '../../../../lib/controllers/auth';

export async function POST(request) {
  try {
    const result = await AuthController.logout();
    return NextResponse.json(result);
  } catch (err) {
    console.error('Error logging out:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}