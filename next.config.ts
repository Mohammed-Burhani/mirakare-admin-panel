import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  typescript: {
    ignoreBuildErrors: true, // ✅ disables type checking at build time
  },
  eslint:{
    ignoreDuringBuilds:true
  }
};

export default nextConfig;
