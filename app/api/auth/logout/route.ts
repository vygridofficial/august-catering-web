import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('august_catering_admin_session');
  return NextResponse.json({ success: true });
}
