import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Cache Components disabled - incompatible with Supabase cookies + prerendering
  // Attempted 'use cache: private' strategy but encountered build errors
  // See docs/architecture/caching-strategy.md for investigation details
  // cacheComponents: true,
};

export default nextConfig;
