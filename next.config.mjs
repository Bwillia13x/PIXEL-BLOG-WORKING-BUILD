/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enhanced Image Optimization
  images: {
    // Enable multiple formats for better compression
    formats: ['image/avif', 'image/webp'],
    
    // Optimize image quality based on device capabilities
    deviceSizes: [640, 750, 828, 1080, 1200, 1400, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Enable advanced optimization
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    // Optimize for different connection speeds
    minimumCacheTTL: 31536000, // 1 year cache
    
    // Enable responsive loading
    loader: 'default',
    
    // Size optimization
    unoptimized: false,
    
    // Remote patterns for external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Compress HTML in production
  compress: true,
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Temporarily ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Temporarily ignore TypeScript errors during build  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
    webVitalsAttribution: ['CLS', 'LCP'],
  },
  
  // Headers for better caching
  async headers() {
    return [
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=31536000',
          },
        ],
      },
    ]
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize for production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            common: {
              minChunks: 2,
              chunks: 'all',
              enforce: true,
            },
          },
        },
      }
    }
    
    return config
  },
  
  // Bundle analysis configuration
  ...(process.env.ANALYZE === 'true' && {
    productionBrowserSourceMaps: true,
  }),
}

export default nextConfig