import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
//
// export default clerkMiddleware({
//   // debug: true, // Use to debug Auth issues
//   publicRoutes: ['/', 'events/:id', '/api/webhook/clerk', '/api/uploadthing'],
//   ignoredRoutes: ['/api/webhook/clerk'],
// });
//
// export const config = {
//   matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
// };

const isProtectedRoute = createRouteMatcher([
  '/events/create',
  '/events/(.*)/update',
  '/profile',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
