import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Database } from "@/types/database"

/**
 * Create a Supabase client for server-side operations
 * Uses the secret key (keep this secret, never expose in frontend!)
 * Handles cookies for auth state persistence
 * Use in Server Components, Server Actions, and API Routes
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll can fail in Server Components with dynamic rendering
            // This is expected when middleware is refreshing user sessions
            // No need to throw, middleware will handle it
          }
        },
      },
    }
  )
}
