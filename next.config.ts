import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // domains: ["*", "*.pinimg.com"]
    remotePatterns: [
      { protocol: "https", hostname: "*" },
      { protocol: "https", hostname: "*" },
    ],
  },
  // cors settings if needed
};

export default nextConfig;
