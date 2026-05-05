import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [{protocol: 'https', hostname: 'cdn.sanity.io'}],
    qualities: [75, 85],
  },
};

export default nextConfig;
