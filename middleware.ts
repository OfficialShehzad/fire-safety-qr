import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const session = request.cookies.get('session');

    // Define the paths that require authentication
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!session) {
            // If no session cookie exists, redirect to login
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // If user is logged in and tries to access login/register, redirect to dashboard
    if (request.nextUrl.pathname === '/login' && session) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// Ensure the middleware only runs on specific paths
export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};