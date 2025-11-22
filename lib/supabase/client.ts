import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Create a Supabase client for browser-side operations
 * Uses the publishable key (safe to expose in frontend)
 * Handles auth state automatically
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
