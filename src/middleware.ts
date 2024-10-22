import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  // debug: true, // Use to debug Auth issues
  publicRoutes: ['/', 'events/:id', '/api/webhook/clerk', '/api/uploadthing'],
  ignoredRoutes: ['/api/webhook/clerk'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
