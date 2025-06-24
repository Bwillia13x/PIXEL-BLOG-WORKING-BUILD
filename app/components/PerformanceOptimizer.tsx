"use client"

import { useEffect, useState, useRef } from 'react'


interface PerformanceOptimizerProps {
  children: React.ReactNode
  threshold?: number
  rootMargin?: string
  fallback?: React.ReactNode
  priority?: 'high' | 'medium' | 'low'
}

export const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  children,
  threshold = 0.1,
  rootMargin = '50px',
  fallback = null,
  priority = 'medium'
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(priority === 'high')
  const elementRef = useRef<HTMLDivElement | null>(null)

  const entry = useIntersectionObserver(elementRef, {
    threshold,
    rootMargin,
    freezeOnceVisible: true
  })

  useEffect(() => {
    if (entry?.isIntersecting && !isVisible) {
      setIsVisible(true)
      // Delayed rendering for non-critical components
      if (priority === 'low') {
        const timer = setTimeout(() => setShouldRender(true), 100)
        return () => clearTimeout(timer)
      } else {
        setShouldRender(true)
      }
    }
  }, [entry?.isIntersecting, isVisible, priority])

  return (
    <div ref={elementRef} className="performance-optimized-container">
      {shouldRender ? children : fallback}
    </div>
  )
}

// Hook for intersection observer
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element | null>,
  options: IntersectionObserverInit & { freezeOnceVisible?: boolean } = {}
) => {
  const [entry, setEntry] = useState<IntersectionObserverEntry>()

  const { threshold, root, rootMargin, freezeOnceVisible } = options

  const frozen = entry?.isIntersecting && freezeOnceVisible

  useEffect(() => {
    const node = elementRef?.current
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport || frozen || !node) return

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(([entry]) => setEntry(entry), observerParams)

    observer.observe(node)

    return () => observer.disconnect()
  }, [elementRef, threshold, root, rootMargin, frozen])

  return entry
}

// Image optimization component
interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder = 'empty',
  blurDataURL
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const entry = useIntersectionObserver(imgRef, {
    threshold: 0,
    rootMargin: '200px'
  })

  const shouldLoad = priority || entry?.isIntersecting

  useEffect(() => {
    if (!shouldLoad) return

    const img = new Image()
    img.src = src
    img.onload = () => setIsLoaded(true)
    img.onerror = () => setError(true)
  }, [shouldLoad, src])

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder */}
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center"
          aria-hidden="true"
        >
          {placeholder === 'blur' && blurDataURL ? (
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={blurDataURL}
              alt=""
              className="w-full h-full object-cover filter blur-sm scale-110"
              aria-hidden="true"
            />
          ) : (
            <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div 
          className="absolute inset-0 bg-gray-800 flex items-center justify-center text-gray-400 text-sm"
          role="img"
          aria-label="Image failed to load"
        >
          <span>Failed to load image</span>
        </div>
      )}

      {/* Actual image */}
      {isLoaded && !error && (
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}
    </div>
  )
}

// Performance metrics component
export const PerformanceMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<{
    lcp?: number
    fid?: number
    cls?: number
    fcp?: number
    ttfb?: number
  }>({})

  useEffect(() => {
    // Web Vitals measurement
    const measureWebVitals = () => {
      // LCP - Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformanceEntry
        setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }))
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // FID - First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: PerformanceEntry) => {
          const fidEntry = entry as PerformanceEntry & { processingStart?: number }
          if (fidEntry.processingStart) {
            setMetrics(prev => ({ ...prev, fid: fidEntry.processingStart! - entry.startTime }))
          }
        })
      }).observe({ entryTypes: ['first-input'] })

      // CLS - Cumulative Layout Shift
      let clsValue = 0
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const clsEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }
          if (!clsEntry.hadRecentInput && clsEntry.value) {
            clsValue += clsEntry.value
            setMetrics(prev => ({ ...prev, cls: clsValue }))
          }
        }
      }).observe({ entryTypes: ['layout-shift'] })

      // FCP - First Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          setMetrics(prev => ({ ...prev, fcp: entry.startTime }))
        })
      }).observe({ entryTypes: ['paint'] })

      // TTFB - Time to First Byte
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        setMetrics(prev => ({ ...prev, ttfb: navigation.responseStart - navigation.requestStart }))
      }
    }

    measureWebVitals()
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-green-400 p-2 rounded text-xs font-mono z-[9999] max-w-xs">
      <div className="font-bold mb-1">Core Web Vitals</div>
      {metrics.lcp && <div>LCP: {Math.round(metrics.lcp)}ms</div>}
      {metrics.fid && <div>FID: {Math.round(metrics.fid)}ms</div>}
      {metrics.cls && <div>CLS: {metrics.cls.toFixed(3)}</div>}
      {metrics.fcp && <div>FCP: {Math.round(metrics.fcp)}ms</div>}
      {metrics.ttfb && <div>TTFB: {Math.round(metrics.ttfb)}ms</div>}
    </div>
  )
}

export default PerformanceOptimizer