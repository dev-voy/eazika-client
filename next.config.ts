import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // domains: ["*", "*.pinimg.com"]
    remotePatterns: [
      { protocol: "https", hostname: "*" },
      { protocol: "https", hostname: "*" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  // cors settings if needed
};

export default nextConfig;
