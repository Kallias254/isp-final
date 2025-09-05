import type { NextConfig } from "next";
require('dotenv').config({ path: '../.env' });

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:${process.env.BACKEND_PORT || 3001}/api/:path*`,
      },
    ]
  },
};

export default nextConfig;