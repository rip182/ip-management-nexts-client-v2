import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'http://ip-management.test/:path*'
      },
    ];
  },
};

export default nextConfig;
