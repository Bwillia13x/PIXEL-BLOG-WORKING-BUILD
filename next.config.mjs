/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove these settings for production - they're only for development
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  // REMOVED: Custom build ID that may be causing issues
  // generateBuildId: async () => {
  //   return `build-${Date.now()}-${Math.random().toString(36).substring(7)}`
  // },
  // Disable static optimization for blog pages to force regeneration
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
  // Force cache invalidation with headers
  async headers() {
    return [
      {
        source: '/blog/:slug*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'no-store',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'no-store',
          },
        ],
      },
    ]
  },
  images: {
    // Enable image optimization for better performance
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Add domains for external images if needed
    remotePatterns: [
      // Example: Enable if you use external image sources
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      // },
    ],
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig