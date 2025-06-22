/**
 * Performance Monitoring for Image Optimization
 * Tracks image loading performance and optimization effectiveness
 */

interface ImageLoadMetrics {
  src: string
  startTime: number
  loadTime: number
  fileSize?: number
  format: string
  connectionSpeed: string
  devicePixelRatio: number
  compressionLevel: string
  wasOptimized: boolean
  cacheHit: boolean
  errorOccurred: boolean
}

interface PerformanceReport {
  totalImages: number
  averageLoadTime: number
  totalFileSize: number
  optimizationSavings: number
  cacheHitRate: number
  errorRate: number
  slowestImages: ImageLoadMetrics[]
  fastestImages: ImageLoadMetrics[]
  formatDistribution: Record<string, number>
  connectionSpeedDistribution: Record<string, number>
}

class ImagePerformanceMonitor {
  private metrics: ImageLoadMetrics[] = []
  private maxMetrics = 1000 // Keep last 1000 image loads
  private observer: PerformanceObserver | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializePerformanceObserver()
      this.setupUnloadHandler()
    }
  }

  private initializePerformanceObserver() {
    if ('PerformanceObserver' in window) {
      try {
        this.observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'resource' && this.isImageResource(entry.name)) {
              this.recordResourceTiming(entry as PerformanceResourceTiming)
            }
          })
        })

        this.observer.observe({ entryTypes: ['resource'] })
      } catch (error) {
        console.warn('Performance monitoring not available:', error)
      }
    }
  }

  private isImageResource(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?|$)/i.test(url)
  }

  private recordResourceTiming(entry: PerformanceResourceTiming) {
    const connectionSpeed = this.detectConnectionSpeed()
    const devicePixelRatio = window.devicePixelRatio || 1
    
    const metrics: ImageLoadMetrics = {
      src: entry.name,
      startTime: entry.startTime,
      loadTime: entry.duration,
      fileSize: entry.transferSize || undefined,
      format: this.extractImageFormat(entry.name),
      connectionSpeed,
      devicePixelRatio,
      compressionLevel: this.detectCompressionLevel(entry.name),
      wasOptimized: this.isOptimizedImage(entry.name),
      cacheHit: entry.transferSize === 0,
      errorOccurred: false
    }

    this.addMetric(metrics)
  }

  private detectConnectionSpeed(): string {
    const connection = (navigator as any).connection || (navigator as any).mozConnection
    if (connection) {
      const effectiveType = connection.effectiveType
      if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow'
      if (effectiveType === '3g') return 'medium'
      return 'fast'
    }
    return 'unknown'
  }

  private extractImageFormat(url: string): string {
    const match = url.match(/\.([a-zA-Z0-9]+)(\?|$)/)
    return match ? match[1].toLowerCase() : 'unknown'
  }

  private detectCompressionLevel(url: string): string {
    // Detect if image is using Next.js optimization
    if (url.includes('/_next/image')) {
      const qualityMatch = url.match(/q=(\d+)/)
      if (qualityMatch) {
        const quality = parseInt(qualityMatch[1])
        if (quality >= 90) return 'low'
        if (quality >= 75) return 'medium'
        if (quality >= 60) return 'high'
        return 'ultra'
      }
    }
    return 'unknown'
  }

  private isOptimizedImage(url: string): boolean {
    return url.includes('/_next/image') || 
           url.includes('.webp') || 
           url.includes('.avif') ||
           url.includes('optimized')
  }

  private addMetric(metric: ImageLoadMetrics) {
    this.metrics.push(metric)
    
    // Keep only the most recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }
  }

  private setupUnloadHandler() {
    window.addEventListener('beforeunload', () => {
      this.sendPerformanceReport()
    })
  }

  // Public methods

  /**
   * Manually track image load start
   */
  startImageLoad(src: string): number {
    return performance.now()
  }

  /**
   * Manually track image load completion
   */
  endImageLoad(src: string, startTime: number, wasSuccessful: boolean = true, fileSize?: number) {
    const loadTime = performance.now() - startTime
    const connectionSpeed = this.detectConnectionSpeed()
    const devicePixelRatio = window.devicePixelRatio || 1

    const metrics: ImageLoadMetrics = {
      src,
      startTime,
      loadTime,
      fileSize,
      format: this.extractImageFormat(src),
      connectionSpeed,
      devicePixelRatio,
      compressionLevel: this.detectCompressionLevel(src),
      wasOptimized: this.isOptimizedImage(src),
      cacheHit: loadTime < 50, // Assume very fast loads are cache hits
      errorOccurred: !wasSuccessful
    }

    this.addMetric(metrics)
  }

  /**
   * Generate performance report
   */
  generateReport(): PerformanceReport {
    if (this.metrics.length === 0) {
      return {
        totalImages: 0,
        averageLoadTime: 0,
        totalFileSize: 0,
        optimizationSavings: 0,
        cacheHitRate: 0,
        errorRate: 0,
        slowestImages: [],
        fastestImages: [],
        formatDistribution: {},
        connectionSpeedDistribution: {}
      }
    }

    const totalImages = this.metrics.length
    const successfulLoads = this.metrics.filter(m => !m.errorOccurred)
    const averageLoadTime = successfulLoads.reduce((sum, m) => sum + m.loadTime, 0) / successfulLoads.length
    const totalFileSize = this.metrics.reduce((sum, m) => sum + (m.fileSize || 0), 0)
    
    // Calculate optimization savings (estimate)
    const optimizedImages = this.metrics.filter(m => m.wasOptimized)
    const unoptimizedImages = this.metrics.filter(m => !m.wasOptimized)
    const avgOptimizedSize = optimizedImages.reduce((sum, m) => sum + (m.fileSize || 0), 0) / Math.max(optimizedImages.length, 1)
    const avgUnoptimizedSize = unoptimizedImages.reduce((sum, m) => sum + (m.fileSize || 0), 0) / Math.max(unoptimizedImages.length, 1)
    const optimizationSavings = Math.max(0, avgUnoptimizedSize - avgOptimizedSize)

    const cacheHits = this.metrics.filter(m => m.cacheHit).length
    const cacheHitRate = (cacheHits / totalImages) * 100

    const errors = this.metrics.filter(m => m.errorOccurred).length
    const errorRate = (errors / totalImages) * 100

    // Top 5 slowest and fastest images
    const sortedByLoadTime = [...successfulLoads].sort((a, b) => b.loadTime - a.loadTime)
    const slowestImages = sortedByLoadTime.slice(0, 5)
    const fastestImages = sortedByLoadTime.slice(-5).reverse()

    // Format distribution
    const formatDistribution: Record<string, number> = {}
    this.metrics.forEach(m => {
      formatDistribution[m.format] = (formatDistribution[m.format] || 0) + 1
    })

    // Connection speed distribution
    const connectionSpeedDistribution: Record<string, number> = {}
    this.metrics.forEach(m => {
      connectionSpeedDistribution[m.connectionSpeed] = (connectionSpeedDistribution[m.connectionSpeed] || 0) + 1
    })

    return {
      totalImages,
      averageLoadTime,
      totalFileSize,
      optimizationSavings,
      cacheHitRate,
      errorRate,
      slowestImages,
      fastestImages,
      formatDistribution,
      connectionSpeedDistribution
    }
  }

  /**
   * Get real-time metrics
   */
  getCurrentMetrics() {
    const recent = this.metrics.slice(-10) // Last 10 images
    return {
      recentLoadTimes: recent.map(m => m.loadTime),
      averageRecentLoadTime: recent.reduce((sum, m) => sum + m.loadTime, 0) / Math.max(recent.length, 1),
      currentConnectionSpeed: this.detectConnectionSpeed(),
      cacheHitRate: (recent.filter(m => m.cacheHit).length / Math.max(recent.length, 1)) * 100
    }
  }

  /**
   * Send performance report to analytics
   */
  private sendPerformanceReport() {
    const report = this.generateReport()
    
    // Log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.group('🖼️ Image Performance Report')
      console.log('Total Images:', report.totalImages)
      console.log('Average Load Time:', `${report.averageLoadTime.toFixed(2)}ms`)
      console.log('Total File Size:', `${(report.totalFileSize / 1024 / 1024).toFixed(2)}MB`)
      console.log('Cache Hit Rate:', `${report.cacheHitRate.toFixed(1)}%`)
      console.log('Error Rate:', `${report.errorRate.toFixed(1)}%`)
      console.log('Format Distribution:', report.formatDistribution)
      console.log('Connection Speed Distribution:', report.connectionSpeedDistribution)
      console.groupEnd()
    }

    // Send to analytics service (implement your analytics integration here)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'image_performance_report', {
        custom_parameter_total_images: report.totalImages,
        custom_parameter_avg_load_time: Math.round(report.averageLoadTime),
        custom_parameter_cache_hit_rate: Math.round(report.cacheHitRate),
        custom_parameter_error_rate: Math.round(report.errorRate)
      })
    }
  }

  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations(): string[] {
    const report = this.generateReport()
    const recommendations: string[] = []

    if (report.averageLoadTime > 1000) {
      recommendations.push('Consider using lower quality settings for images')
    }

    if (report.cacheHitRate < 50) {
      recommendations.push('Enable longer cache headers for better performance')
    }

    if (report.errorRate > 5) {
      recommendations.push('Check for broken image links and improve error handling')
    }

    const jpegCount = report.formatDistribution.jpeg || 0
    const pngCount = report.formatDistribution.png || 0
    const webpCount = report.formatDistribution.webp || 0
    const avifCount = report.formatDistribution.avif || 0

    if ((jpegCount + pngCount) > (webpCount + avifCount)) {
      recommendations.push('Convert more images to WebP or AVIF format for better compression')
    }

    const slowConnection = report.connectionSpeedDistribution.slow || 0
    if (slowConnection > report.totalImages * 0.3) {
      recommendations.push('Implement aggressive compression for slow connections')
    }

    return recommendations
  }

  /**
   * Clean up observer
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  }
}

// Singleton instance
let monitor: ImagePerformanceMonitor | null = null

export function getImagePerformanceMonitor(): ImagePerformanceMonitor {
  if (!monitor) {
    monitor = new ImagePerformanceMonitor()
  }
  return monitor
}

// Hook for React components
export function useImagePerformanceMonitor() {
  const monitor = getImagePerformanceMonitor()

  const trackImageLoad = (src: string): number => {
    return monitor.startImageLoad(src)
  }

  const recordImageLoad = (src: string, startTime: number, success: boolean = true, fileSize?: number) => {
    monitor.endImageLoad(src, startTime, success, fileSize)
  }

  const getCurrentMetrics = () => monitor.getCurrentMetrics()
  const getReport = () => monitor.generateReport()
  const getRecommendations = () => monitor.getOptimizationRecommendations()

  return {
    trackImageLoad,
    recordImageLoad,
    getCurrentMetrics,
    getReport,
    getRecommendations
  }
}

// Utility function to preload critical images
export function preloadCriticalImages(imageSources: string[]) {
  if (typeof window === 'undefined') return

  const monitor = getImagePerformanceMonitor()

  imageSources.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    
    const startTime = monitor.startImageLoad(src)
    
    link.onload = () => {
      monitor.endImageLoad(src, startTime, true)
    }
    
    link.onerror = () => {
      monitor.endImageLoad(src, startTime, false)
    }
    
    document.head.appendChild(link)
  })
}

// Export types for external use
export type { ImageLoadMetrics, PerformanceReport } 