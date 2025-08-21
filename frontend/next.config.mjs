/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // Disable Turbopack for production builds
    turbo: false
  }
};

export default nextConfig;
