import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Proxy function for Next.js 16
 *
 * Purpose: Perform OPTIMISTIC auth checks for fast redirects
 * - Only reads session from cookie (no database calls)
 * - Redirects unauthenticated users from protected routes
 * - Redirects authenticated users away from auth pages
 *
 * Security Note: This is NOT the only line of defense!
 * Always verify sessions in Server Components, Actions, and Route Handlers
 * using the Data Access Layer (DAL) for secure database checks.
 *
 * This replaces the deprecated middleware.ts file in Next.js 16+
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  // Create Supabase client with cookie management
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({
            request,
          });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  // OPTIMISTIC CHECK: Read session from cookie only (fast, no DB query)
  // This is sufficient for redirects, but NOT for data access control
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Define public routes (accessible without authentication)
  const publicRoutes = ["/", "/login", "/register"];

  // Check if path is public or matches public patterns
  const isPublicRoute =
    publicRoutes.includes(path) ||
    // Allow public access to tournament registration pages
    (path.startsWith("/torneos/") && path.endsWith("/inscripcion"));

  // Redirect unauthenticated users to login when accessing protected routes
  if (!isPublicRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from auth pages to dashboard
  if ((path === "/login" || path === "/register") && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

/**
 * Matcher configuration
 *
 * Uses negative lookahead regex to match ALL routes EXCEPT:
 * - /api/* - API routes
 * - /_next/static/* - Static files
 * - /_next/image/* - Image optimization
 * - Metadata files (favicon.ico, sitemap.xml, robots.txt)
 *
 * This ensures proxy runs on actual page routes only
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - Files with extensions (images, fonts, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)",
  ],
};
