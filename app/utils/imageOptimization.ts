/**
 * Advanced Image Optimization Utilities
 * Handles intelligent compression, format selection, and responsive sizing
 */

export interface ImageOptimizationOptions {
  quality?: number
  format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png'
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
  loading?: 'lazy' | 'eager'
  placeholder?: 'blur' | 'empty'
  compression?: 'low' | 'medium' | 'high' | 'ultra'
  responsive?: boolean
  criticalResource?: boolean
}

export interface DeviceCapabilities {
  supportsWebP: boolean
  supportsAVIF: boolean
  devicePixelRatio: number
  connectionSpeed: 'slow' | 'medium' | 'fast'
  prefersReducedData: boolean
  screenWidth: number
}

/**
 * Detect device capabilities and connection speed
 */
export function detectDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === 'undefined') {
    // Server-side defaults
    return {
      supportsWebP: true,
      supportsAVIF: true,
      devicePixelRatio: 1,
      connectionSpeed: 'fast',
      prefersReducedData: false,
      screenWidth: 1920
    }
  }

  // Check format support
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext('2d')
  
  const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  
  // AVIF support check
  const supportsAVIF = (() => {
    try {
      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
    } catch {
      return false
    }
  })()

  // Connection speed detection
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  let connectionSpeed: 'slow' | 'medium' | 'fast' = 'fast'
  
  if (connection) {
    const effectiveType = connection.effectiveType
    const downlink = connection.downlink
    
    if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 1.5) {
      connectionSpeed = 'slow'
    } else if (effectiveType === '3g' || downlink < 5) {
      connectionSpeed = 'medium'
    }
  }

  // Check for reduced data preference
  const prefersReducedData = window.matchMedia('(prefers-reduced-data: reduce)').matches

  return {
    supportsWebP,
    supportsAVIF,
    devicePixelRatio: window.devicePixelRatio || 1,
    connectionSpeed,
    prefersReducedData,
    screenWidth: window.screen.width
  }
}

/**
 * Calculate optimal image quality based on device and connection
 */
export function calculateOptimalQuality(
  compression: string = 'medium',
  capabilities: DeviceCapabilities
): number {
  const baseQuality = {
    low: 95,
    medium: 85,
    high: 75,
    ultra: 65
  }[compression] || 85

  let quality = baseQuality

  // Adjust for connection speed
  if (capabilities.connectionSpeed === 'slow') {
    quality = Math.max(quality - 20, 50)
  } else if (capabilities.connectionSpeed === 'medium') {
    quality = Math.max(quality - 10, 60)
  }

  // Adjust for data saver mode
  if (capabilities.prefersReducedData) {
    quality = Math.max(quality - 15, 45)
  }

  // Adjust for high DPI displays
  if (capabilities.devicePixelRatio > 2) {
    quality = Math.min(quality + 5, 95)
  }

  return Math.round(quality)
}

/**
 * Determine optimal image format based on browser support and content
 */
export function getOptimalFormat(
  originalFormat: string,
  capabilities: DeviceCapabilities,
  options: ImageOptimizationOptions = {}
): string {
  if (options.format && options.format !== 'auto') {
    return options.format
  }

  // Prefer AVIF for maximum compression
  if (capabilities.supportsAVIF && !capabilities.prefersReducedData) {
    return 'avif'
  }

  // Fallback to WebP
  if (capabilities.supportsWebP) {
    return 'webp'
  }

  // Use original format or JPEG as final fallback
  return originalFormat === 'png' ? 'png' : 'jpeg'
}

/**
 * Generate responsive sizes based on breakpoints and usage context
 */
export function generateResponsiveSizes(
  width: number | undefined,
  responsive: boolean = true,
  context: 'hero' | 'card' | 'thumbnail' | 'avatar' | 'content' = 'content'
): string {
  if (!responsive && width) {
    return `${width}px`
  }

  const sizeConfigs = {
    hero: '100vw',
    card: '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw',
    thumbnail: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    avatar: '(max-width: 768px) 64px, 128px',
    content: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw'
  }

  return sizeConfigs[context]
}

/**
 * Calculate optimal dimensions based on container and device
 */
export function calculateOptimalDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  capabilities: DeviceCapabilities
): { width: number; height: number } {
  const dpr = capabilities.devicePixelRatio
  const screenWidth = capabilities.screenWidth

  // Don't scale beyond screen width
  const effectiveMaxWidth = Math.min(maxWidth, screenWidth)
  
  // Adjust for device pixel ratio but cap at 2x for performance
  const scaleFactor = Math.min(dpr, 2)
  const targetWidth = effectiveMaxWidth * scaleFactor

  // Maintain aspect ratio
  const aspectRatio = originalHeight / originalWidth
  const targetHeight = targetWidth * aspectRatio

  return {
    width: Math.round(targetWidth),
    height: Math.round(targetHeight)
  }
}

/**
 * Generate blur placeholder data URL
 */
export function generateBlurPlaceholder(
  width: number,
  height: number,
  color: string = '#1f2937'
): string {
  const aspectRatio = height / width
  const blurWidth = 20
  const blurHeight = Math.round(blurWidth * aspectRatio)

  const svg = `
    <svg width="${blurWidth}" height="${blurHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="50%" style="stop-color:#374151;stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
        </linearGradient>
        <filter id="blur">
          <feGaussianBlur stdDeviation="2"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" filter="url(#blur)"/>
    </svg>
  `

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

/**
 * Build optimized image URL with all optimizations applied
 */
export function buildOptimizedImageUrl(
  src: string,
  options: ImageOptimizationOptions = {},
  capabilities?: DeviceCapabilities
): {
  src: string
  quality: number
  format: string
  sizes: string
  blurDataURL?: string
} {
  const deviceCapabilities = capabilities || detectDeviceCapabilities()
  
  // Calculate optimal quality
  const quality = calculateOptimalQuality(options.compression, deviceCapabilities)
  
  // Determine format
  const originalFormat = src.split('.').pop()?.toLowerCase() || 'jpeg'
  const format = getOptimalFormat(originalFormat, deviceCapabilities, options)
  
  // Generate responsive sizes
  const sizes = options.sizes || generateResponsiveSizes(
    options.width,
    options.responsive,
    'content'
  )
  
  // Generate blur placeholder if needed
  const blurDataURL = options.placeholder === 'blur' && options.width && options.height
    ? generateBlurPlaceholder(options.width, options.height)
    : undefined

  return {
    src,
    quality,
    format,
    sizes,
    blurDataURL
  }
}

/**
 * Preload critical images for better performance
 */
export function preloadCriticalImages(images: Array<{ src: string; priority: boolean }>) {
  if (typeof window === 'undefined') return

  const capabilities = detectDeviceCapabilities()
  
  images.forEach(({ src, priority }) => {
    if (priority) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      
      // Use optimal format for preloading
      const format = getOptimalFormat(
        src.split('.').pop() || 'jpeg',
        capabilities
      )
      
      if (format !== 'jpeg') {
        link.type = `image/${format}`
      }
      
      document.head.appendChild(link)
    }
  })
}

/**
 * Lazy load images with intersection observer
 */
export function createLazyImageObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  rootMargin: string = '50px'
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }

  return new IntersectionObserver(
    (entries) => {
      entries.forEach(callback)
    },
    {
      rootMargin,
      threshold: 0.1
    }
  )
}

/**
 * Monitor image loading performance
 */
export function trackImagePerformance(src: string, startTime: number) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const loadTime = performance.now() - startTime
    
    // Report to analytics (implement your analytics solution)
    console.log(`Image loaded: ${src} in ${loadTime.toFixed(2)}ms`)
    
    // You can integrate with your analytics service here
    // analytics.track('image_load_time', { src, loadTime })
  }
}

/**
 * Default optimization configurations for different use cases
 */
export const IMAGE_PRESETS = {
  hero: {
    compression: 'high' as const,
    quality: 90,
    responsive: true,
    priority: true,
    sizes: '100vw',
    placeholder: 'blur' as const
  },
  card: {
    compression: 'medium' as const,
    quality: 85,
    responsive: true,
    priority: false,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    placeholder: 'blur' as const
  },
  thumbnail: {
    compression: 'medium' as const,
    quality: 80,
    responsive: true,
    priority: false,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    placeholder: 'blur' as const
  },
  avatar: {
    compression: 'low' as const,
    quality: 90,
    responsive: false,
    priority: false,
    placeholder: 'empty' as const
  },
  icon: {
    compression: 'low' as const,
    quality: 95,
    responsive: false,
    priority: false,
    placeholder: 'empty' as const
  }
} as const 