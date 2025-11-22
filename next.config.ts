import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // cacheComponents disabled - incompatible with Supabase cookies authentication
  // cacheComponents: true,
};

export default nextConfig;
