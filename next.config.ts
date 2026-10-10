import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  async redirects() {
    return [
      { source: "/guides", destination: "/blogs", permanent: true },
      { source: "/guides/:slug", destination: "/blogs/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
