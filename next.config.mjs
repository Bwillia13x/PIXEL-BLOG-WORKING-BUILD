/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily disable export for Vercel deployment
  // output: 'export',
  // trailingSlash: true,
  
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
}

export default nextConfig