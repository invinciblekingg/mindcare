import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export default auth((req) => {
  // Frontend-only preview mode: pass through so developer and user can preview Student, Counsellor, and Admin views with mock data
  if (process.env.ENABLE_REAL_AUTH !== 'true') {
    return NextResponse.next();
  }

  const isLoggedIn = !!req.auth;
  const user = req.auth?.user;
  const pathname = req.nextUrl.pathname;

  const isProtectedPath = 
    pathname.startsWith('/counsellor') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/journal') ||
    pathname.startsWith('/companion');

  if (isProtectedPath && !isLoggedIn) {
    const signInUrl = new URL('/auth/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(signInUrl);
  }

  if (isLoggedIn) {
    // Block SUSPENDED or DELETED accounts from all protected paths
    if (
      isProtectedPath &&
      (user?.status === 'SUSPENDED' || user?.status === 'DELETED')
    ) {
      return NextResponse.redirect(new URL('/auth/signin?error=AccountInactive', req.url));
    }

    if (
      user?.role === 'STUDENT' &&
      user?.status === 'PENDING_CONSENT' &&
      !pathname.startsWith('/onboarding/consent')
    ) {
      return NextResponse.redirect(new URL('/onboarding/consent', req.url));
    }

    if (pathname.startsWith('/admin')) {
      if (user?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    if (pathname.startsWith('/counsellor')) {
      if (user?.role !== 'COUNSELLOR' && user?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

