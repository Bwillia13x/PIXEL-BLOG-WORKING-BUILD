/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Enable image optimization for better performance
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Add domains for external images if needed
    remotePatterns: [
      // Example: Enable if you use external image sources
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Optimize webpack for development and exclude problematic directories
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Exclude problematic directories from file watching
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
          '**/public/projects/**',
          '**/*.log',
          '**/dist/**',
          '**/build/**',
          '**/.vercel/**',
          '**/.env*',
        ],
        // Reduce polling frequency
        poll: 1000,
        // Add aggregation timeout to batch changes
        aggregateTimeout: 300,
      }
    }
    return config
  },
}

export default nextConfig