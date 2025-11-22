import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // Create response object for cookie updates
  let response = NextResponse.next({
    request,
  });

  // Create Supabase client with cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SECRET_KEY || "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Use for...of instead of forEach to avoid returning values
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          // Create new response with updated cookies
          response = NextResponse.next({
            request,
          });
          // Use for...of instead of forEach to avoid returning values
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect dashboard routes - redirect to login if not authenticated
  if (request.nextUrl.pathname.startsWith("/(dashboard)") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to dashboard if logged in and trying to access auth pages
  if (request.nextUrl.pathname.startsWith("/(auth)") && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

// Configure which routes trigger the proxy
export const config = {
  matcher: ["/(auth)/:path*", "/(dashboard)/:path*"],
};
