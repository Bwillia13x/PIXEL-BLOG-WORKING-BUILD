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
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    minimumCacheTTL: 31536000, // 1 year
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
    webVitalsAttribution: ['CLS', 'LCP'],
  },

  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Bundle analysis configuration
  ...(process.env.ANALYZE === 'true' && {
    productionBrowserSourceMaps: true,
  }),

  // Optimize webpack for development and exclude problematic directories
  webpack: (config, { dev, isServer }) => {
    // Bundle analysis setup
    if (process.env.ANALYZE === 'true') {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
            },
            common: {
              minChunks: 2,
              priority: -5,
              reuseExistingChunk: true,
            },
          },
        },
      }
    }

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

    // Optimize for client-side performance
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config
  },

  // Performance optimizations
  poweredByHeader: false,
  compress: true,

  // Headers for performance
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
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=600',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects for clean URLs
  async redirects() {
    return [
      {
        source: '/blog/',
        destination: '/blog',
        permanent: true,
      },
    ];
  },
}

export default nextConfig