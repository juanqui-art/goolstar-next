"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type Login, loginSchema } from "@/lib/validations/auth";

export function LoginForm() {
  const form = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [state, formAction, isPending] = useActionState(
    async (_prevState: any, formData: FormData) => {
      const email = formData.get("email");
      const password = formData.get("password");
      return login({ email, password });
    },
    null,
  );

  // Show error if login failed
  const errorMessage =
    state?.error && typeof state.error === "string" ? state.error : null;

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-6">
        {/* Error message */}
        {errorMessage && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        )}

        {/* Email field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isPending || form.formState.isSubmitting}
        >
          {isPending || form.formState.isSubmitting
            ? "Signing in..."
            : "Sign In"}
        </Button>

        {/* Link to register */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </Form>
  );
}
