import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server' // Import NextResponse

// Use plural name and correct route
const protectedRoutes = createRouteMatcher([
    '/',
    '/previous',
    '/upcomings', // Corrected typo to match folder structure
    '/recordings',
    '/personal-room',
    '/meeting(.*)',
])
    
// Manually check auth status and redirect (make function async)
export default clerkMiddleware(async (auth, req) => { // Add async here
  const { userId } = await auth(); // Add await here
  const isProtectedRoute = protectedRoutes(req); // Check if route is protected

  // If it's a protected route and the user is not logged in, redirect manually
  if (isProtectedRoute && !userId) {
    // Construct the sign-in URL (using environment variable or default)
    // Ensure NEXT_PUBLIC_CLERK_SIGN_IN_URL is set in .env.local or defaults work
    const signInUrl = new URL('/sign-in', req.url) 
    signInUrl.searchParams.set('redirect_url', req.url) // Optional: add redirect back URL
    return NextResponse.redirect(signInUrl);
  }

    // If logged in or not a protected route, allow the request to proceed
    return NextResponse.next();
  },
  {
    authorizedParties: ["https://priyanshu-rathore.live"],
    debug: false,
  }
);

// Use the previous, clearer matcher config
export const config = {
  matcher: [
    // Explicitly match the root route
    '/', 
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
