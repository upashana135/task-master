/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["ui-avatars.com", "placeholder.svg"],
    unoptimized: true,
  },
}

module.exports = nextConfig
