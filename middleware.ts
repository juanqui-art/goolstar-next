import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  // Create response object for cookie updates
  let response = NextResponse.next({
    request,
  })

  // Create Supabase client with cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          // Create new response with updated cookies
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  // Protect dashboard routes - redirect to login if not authenticated
  if (request.nextUrl.pathname.startsWith("/(dashboard)") && !user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect to dashboard if logged in and trying to access auth pages
  if (request.nextUrl.pathname.startsWith("/(auth)") && user) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return response
}

// Configure which routes trigger the middleware
export const config = {
  matcher: [
    "/(auth)/:path*",
    "/(dashboard)/:path*",
  ],
}
