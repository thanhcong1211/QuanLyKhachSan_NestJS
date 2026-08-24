import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image configuration for external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'airbnbnew.cybersoft.edu.vn',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: '*.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'thesinhcafetouronline.com',
      },
      {
        protocol: 'http',
        hostname: 'sc04.alicdn.com',
      },
      {
        protocol: 'https',
        hostname: 'sc04.alicdn.com',
      },
      {
        protocol: 'https',
        hostname: '*.alicdn.com',
      },
      {
        protocol: 'https',
        hostname: '**', // Cho phép mọi domain (dùng cho development)
      },
    ],
  },
  // Suppress ESLint during builds (optional)
  // If you need to suppress ESLint during builds, add a config here.

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
