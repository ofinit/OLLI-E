import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/']);

// In Next.js 16, the file is named proxy.ts and the function exported as `proxy`
export function proxy(request: NextRequest) {
  // Bypass Clerk middleware for local development
  return; 
  /*
  return clerkMiddleware(async (auth) => {
    if (!isPublicRoute(request)) {
      await auth.protect();
    }
  })(request, {} as any);
  */
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
