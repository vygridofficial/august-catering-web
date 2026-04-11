import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.SESSION_SECRET || 'gateway-kitchen-super-secret-key-2026';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any, expiresIn: string = '7d') {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function verifyAdminSession() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('gk_admin_session')?.value;
    if (!sessionToken) return false;

    const payload = await decrypt(sessionToken);
    return payload?.role === 'admin';
  } catch (err) {
    console.error('Session verification failed:', err);
    return false;
  }
}
