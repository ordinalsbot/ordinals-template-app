import type { NextRequest } from 'next/server';
import { SESSION_TOKEN_NAME } from './lib/constants';
 
export function middleware(request: NextRequest) {
  // Grab the session cookie from SESSION_TOKEN_NAME
  const currentUser = request.cookies.get(SESSION_TOKEN_NAME)?.value;

  // If there is no currentUser then we need to check if the user is trying to access an authenticate route (/dashboard/**) and redirect to /login
  if (!currentUser) {
    const { pathname } = request.nextUrl;
    if (pathname.startsWith('/dashboard')) {
      return Response.redirect(new URL('/login', request.url));
    }
  } else {
    const { pathname } = request.nextUrl;
    if (pathname.startsWith('/login')) {
      return Response.redirect(new URL('/dashboard', request.url));
    }
  }
}
 
export const config = {
  matcher: [{
    source: '/dashboard',
  }, '/login'],
};