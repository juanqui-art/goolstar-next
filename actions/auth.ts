"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { loginSchema, registerSchema } from "@/lib/validations/auth"

/**
 * Login with email and password
 * Called by login-form.tsx
 */
export async function login(formData: unknown) {
  try {
    // Validate input
    const { email, password } = loginSchema.parse(formData)
    const supabase = await createServerSupabaseClient()

    // Sign in with Supabase Auth
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Revalidate and redirect
    revalidatePath("/", "layout")
    redirect("/")
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Login failed",
    }
  }
}

/**
 * Register new user with email and password
 * Called by register-form.tsx
 */
export async function register(formData: unknown) {
  try {
    // Validate input
    const { email, password } = registerSchema.parse(formData)
    const supabase = await createServerSupabaseClient()

    // Sign up with Supabase Auth
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })

    if (error) throw error

    // Revalidate and redirect to login with message
    revalidatePath("/", "layout")
    redirect("/login?message=Check your email to confirm your account")
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Registration failed",
    }
  }
}

/**
 * Logout - sign out user and redirect to login
 * Called by navbar logout button
 */
export async function logout() {
  const supabase = await createServerSupabaseClient()

  // Sign out from Supabase Auth
  await supabase.auth.signOut()

  // Revalidate and redirect
  revalidatePath("/", "layout")
  redirect("/login")
}

/**
 * Get current user session
 * Called by components that need user info
 */
export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient()

  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) throw error

    return user
  } catch (error) {
    return null
  }
}
