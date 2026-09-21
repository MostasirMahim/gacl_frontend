/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // ── Local development ──────────────────────────────────────────
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      // ── Production VPS (images served via Nginx on port 80) ───────
      {
        protocol: "http",
        hostname: "172.237.141.11",
        pathname: "/**",
      },
      // ── External image hosts ───────────────────────────────────────
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

