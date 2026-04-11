import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('august_catering_admin_session')?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      const payload = await decrypt(token);
      if (payload?.role === 'admin') {
        isAuthenticated = true;
      }
    } catch (error) {
      // Invalid token
    }
  }
  
  // Protect all /admin routes
  if (path.startsWith('/admin')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Redirect authenticated users away from login page
  if (path === '/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/menu', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
