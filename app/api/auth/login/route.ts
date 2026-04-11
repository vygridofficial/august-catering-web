import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { encrypt } from '@/lib/session';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { password, rememberMe } = await request.json();
    
    // Default fallback hash is 'augustcatering2026' SHA-256
    const expectedHashHex = process.env.ADMIN_PASSWORD_HASH || '2addbec3180bc56d1e9e34515259492a8378acca15d272a92699e61a02001903';
    
    const inputHash = crypto.createHash('sha256').update(password).digest();
    const expectedHash = Buffer.from(expectedHashHex, 'hex');

    let isMatch = false;
    if (inputHash.length === expectedHash.length) {
      isMatch = crypto.timingSafeEqual(inputHash, expectedHash);
    }

    if (isMatch) {
      const cookieStore = await cookies();
      const sessionData = { role: 'admin', timestamp: Date.now() };
      const expiresIn = rememberMe ? '30d' : '7d';
      const encryptedSession = await encrypt(sessionData, expiresIn);
      const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;

      cookieStore.set('august_catering_admin_session', encryptedSession, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge,
        path: '/',
      });
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Invalid credentials. Please attempt again.' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
