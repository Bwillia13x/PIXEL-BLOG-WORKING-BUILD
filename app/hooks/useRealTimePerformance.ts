import { useState, useEffect, useRef, useCallback } from 'react'

interface PerformanceMetrics {
  // Core Web Vitals
  cls: number | null        // Cumulative Layout Shift
  fid: number | null        // First Input Delay
  fcp: number | null        // First Contentful Paint
  lcp: number | null        // Largest Contentful Paint
  ttfb: number | null       // Time to First Byte
  inp: number | null        // Interaction to Next Paint

  // Runtime Performance
  fps: number               // Frames per second
  memoryUsage: number       // Memory usage in MB
  connectionType: string    // Network connection type
  
  // Page Performance
  loadTime: number          // Page load time
  domContentLoaded: number  // DOM ready time
  resourceCount: number     // Number of resources loaded
  transferSize: number      // Total transfer size in KB

  // User Engagement
  timeOnPage: number        // Time spent on page in seconds
  scrollDepth: number       // Maximum scroll depth percentage
  
  // Performance Score
  overallScore: number      // Calculated performance score (0-100)
  scoreBreakdown: {
    loading: number         // Loading performance (0-100)
    interactivity: number   // Interactivity score (0-100)
    visualStability: number // Visual stability score (0-100)
  }
}

interface UseRealTimePerformanceOptions {
  enableFPSMonitoring?: boolean
  enableMemoryMonitoring?: boolean
  enableScrollTracking?: boolean
  reportingInterval?: number // Interval for reporting metrics (ms)
  sampleInterval?: number    // Interval for collecting samples (ms)
}

interface PerformanceThresholds {
  good: { min: number; max: number }
  needsImprovement: { min: number; max: number }
  poor: { min: number; max: number }
}

const THRESHOLDS: Record<string, PerformanceThresholds> = {
  lcp: {
    good: { min: 0, max: 2500 },
    needsImprovement: { min: 2500, max: 4000 },
    poor: { min: 4000, max: Infinity }
  },
  fid: {
    good: { min: 0, max: 100 },
    needsImprovement: { min: 100, max: 300 },
    poor: { min: 300, max: Infinity }
  },
  cls: {
    good: { min: 0, max: 0.1 },
    needsImprovement: { min: 0.1, max: 0.25 },
    poor: { min: 0.25, max: Infinity }
  },
  fcp: {
    good: { min: 0, max: 1800 },
    needsImprovement: { min: 1800, max: 3000 },
    poor: { min: 3000, max: Infinity }
  },
  ttfb: {
    good: { min: 0, max: 800 },
    needsImprovement: { min: 800, max: 1800 },
    poor: { min: 1800, max: Infinity }
  }
}

function getPerformanceRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metric]
  if (!threshold) return 'good'

  if (value <= threshold.good.max) return 'good'
  if (value <= threshold.needsImprovement.max) return 'needs-improvement'
  return 'poor'
}

function calculateScore(metrics: Partial<PerformanceMetrics>): number {
  const weights = {
    lcp: 0.25,
    fid: 0.25,
    cls: 0.25,
    fcp: 0.15,
    ttfb: 0.10
  }

  let totalScore = 0
  let totalWeight = 0

  Object.entries(weights).forEach(([metric, weight]) => {
    const value = metrics[metric as keyof PerformanceMetrics] as number
    if (value !== null && value !== undefined) {
      const rating = getPerformanceRating(metric, value)
      const score = rating === 'good' ? 100 : rating === 'needs-improvement' ? 50 : 0
      totalScore += score * weight
      totalWeight += weight
    }
  })

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0
}

export function useRealTimePerformance(options: UseRealTimePerformanceOptions = {}) {
  const {
    enableFPSMonitoring = true,
    enableMemoryMonitoring = true,
    enableScrollTracking = true,
    reportingInterval = 5000,
    sampleInterval = 1000
  } = options

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cls: null,
    fid: null,
    fcp: null,
    lcp: null,
    ttfb: null,
    inp: null,
    fps: 0,
    memoryUsage: 0,
    connectionType: 'unknown',
    loadTime: 0,
    domContentLoaded: 0,
    resourceCount: 0,
    transferSize: 0,
    timeOnPage: 0,
    scrollDepth: 0,
    overallScore: 0,
    scoreBreakdown: {
      loading: 0,
      interactivity: 0,
      visualStability: 0
    }
  })

  const [isMonitoring, setIsMonitoring] = useState(false)
  const [performanceObserver, setPerformanceObserver] = useState<PerformanceObserver | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const frameCountRef = useRef<number>(0)
  const lastFrameTimeRef = useRef<number>(0)
  const scrollDepthRef = useRef<number>(0)
  const reportingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const samplingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize Web Vitals monitoring
  const initializeWebVitals = useCallback(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return
    }

    try {
      // Monitor LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        if (lastEntry) {
          setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }))
        }
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // Monitor FCP
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        for (const entry of entries) {
          if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, fcp: entry.startTime }))
          }
        }
      })
      fcpObserver.observe({ entryTypes: ['paint'] })

      // Monitor CLS
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            setMetrics(prev => ({ ...prev, cls: clsValue }))
          }
        }
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      // Monitor INP (if supported)
      try {
        const inpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries() as any[]
          for (const entry of entries) {
            if (entry.interactionId) {
              setMetrics(prev => ({ ...prev, inp: entry.processingEnd - entry.startTime }))
            }
          }
        })
        inpObserver.observe({ entryTypes: ['event'] })
      } catch (e) {
        // INP might not be supported
        console.warn('INP monitoring not supported')
      }

      // Monitor Navigation Timing
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      if (navigationEntries.length > 0) {
        const nav = navigationEntries[0]
        setMetrics(prev => ({
          ...prev,
          loadTime: nav.loadEventEnd - nav.loadEventStart,
          domContentLoaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
          ttfb: nav.responseStart - nav.requestStart
        }))
      }

      // Monitor Resource Timing
      const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      const totalTransferSize = resourceEntries.reduce((total, entry) => {
        return total + (entry.transferSize || 0)
      }, 0)

      setMetrics(prev => ({
        ...prev,
        resourceCount: resourceEntries.length,
        transferSize: Math.round(totalTransferSize / 1024) // Convert to KB
      }))

    } catch (error) {
      console.warn('Error initializing Web Vitals monitoring:', error)
    }
  }, [])

  // Monitor FPS
  const monitorFPS = useCallback(() => {
    if (!enableFPSMonitoring) return

    const measureFPS = () => {
      frameCountRef.current++
      const now = performance.now()
      
      if (now - lastFrameTimeRef.current >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (now - lastFrameTimeRef.current))
        setMetrics(prev => ({ ...prev, fps }))
        
        frameCountRef.current = 0
        lastFrameTimeRef.current = now
      }
      
      if (isMonitoring) {
        requestAnimationFrame(measureFPS)
      }
    }
    
    lastFrameTimeRef.current = performance.now()
    requestAnimationFrame(measureFPS)
  }, [enableFPSMonitoring, isMonitoring])

  // Monitor Memory Usage
  const monitorMemory = useCallback(() => {
    if (!enableMemoryMonitoring || typeof window === 'undefined') return

    const updateMemoryUsage = () => {
      try {
        // @ts-ignore - performance.memory is not in TypeScript types but exists in Chrome
        if (performance.memory) {
          // @ts-ignore
          const memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
          setMetrics(prev => ({ ...prev, memoryUsage }))
        }
      } catch (error) {
        console.warn('Memory monitoring not supported')
      }
    }

    updateMemoryUsage()
    const interval = setInterval(updateMemoryUsage, sampleInterval)
    samplingIntervalRef.current = interval
  }, [enableMemoryMonitoring, sampleInterval])

  // Monitor Scroll Depth
  const monitorScrollDepth = useCallback(() => {
    if (!enableScrollTracking) return

    const updateScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollDepth = documentHeight > 0 ? Math.round((scrollTop / documentHeight) * 100) : 0
      
      if (scrollDepth > scrollDepthRef.current) {
        scrollDepthRef.current = scrollDepth
        setMetrics(prev => ({ ...prev, scrollDepth }))
      }
    }

    window.addEventListener('scroll', updateScrollDepth, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollDepth)
  }, [enableScrollTracking])

  // Monitor Connection Type
  const monitorConnection = useCallback(() => {
    if (typeof window === 'undefined') return

    try {
      // @ts-ignore - navigator.connection is not in TypeScript types
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      if (connection) {
        setMetrics(prev => ({ 
          ...prev, 
          connectionType: connection.effectiveType || 'unknown' 
        }))
      }
    } catch (error) {
      console.warn('Connection monitoring not supported')
    }
  }, [])

  // Update time on page
  const updateTimeOnPage = useCallback(() => {
    const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000)
    setMetrics(prev => ({ ...prev, timeOnPage }))
  }, [])

  // Calculate performance scores
  const updatePerformanceScores = useCallback(() => {
    setMetrics(prev => {
      const overallScore = calculateScore(prev)
      
      // Calculate breakdown scores
      const loadingScore = calculateScore({
        lcp: prev.lcp,
        fcp: prev.fcp,
        ttfb: prev.ttfb
      })
      
      const interactivityScore = prev.fid !== null ? 
        (getPerformanceRating('fid', prev.fid) === 'good' ? 100 : 
         getPerformanceRating('fid', prev.fid) === 'needs-improvement' ? 50 : 0) : 0
      
      const visualStabilityScore = prev.cls !== null ?
        (getPerformanceRating('cls', prev.cls) === 'good' ? 100 :
         getPerformanceRating('cls', prev.cls) === 'needs-improvement' ? 50 : 0) : 0

      return {
        ...prev,
        overallScore,
        scoreBreakdown: {
          loading: loadingScore,
          interactivity: interactivityScore,
          visualStability: visualStabilityScore
        }
      }
    })
  }, [])

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (isMonitoring) return

    setIsMonitoring(true)
    startTimeRef.current = Date.now()

    // Initialize all monitoring
    initializeWebVitals()
    monitorConnection()
    
    if (enableFPSMonitoring) {
      monitorFPS()
    }
    
    if (enableMemoryMonitoring) {
      monitorMemory()
    }
    
    const scrollCleanup = monitorScrollDepth()

    // Set up regular updates
    reportingIntervalRef.current = setInterval(() => {
      updateTimeOnPage()
      updatePerformanceScores()
    }, reportingInterval)

    return () => {
      if (scrollCleanup) scrollCleanup()
    }
  }, [
    isMonitoring,
    initializeWebVitals,
    monitorConnection,
    monitorFPS,
    monitorMemory,
    monitorScrollDepth,
    updateTimeOnPage,
    updatePerformanceScores,
    enableFPSMonitoring,
    enableMemoryMonitoring,
    reportingInterval
  ])

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false)
    
    if (performanceObserver) {
      performanceObserver.disconnect()
    }
    
    if (reportingIntervalRef.current) {
      clearInterval(reportingIntervalRef.current)
    }
    
    if (samplingIntervalRef.current) {
      clearInterval(samplingIntervalRef.current)
    }
  }, [performanceObserver])

  // Get performance insights
  const getInsights = useCallback(() => {
    const insights = []

    if (metrics.lcp !== null) {
      const rating = getPerformanceRating('lcp', metrics.lcp)
      if (rating !== 'good') {
        insights.push({
          type: 'warning',
          metric: 'LCP',
          message: `Largest Contentful Paint (${metrics.lcp}ms) ${rating === 'needs-improvement' ? 'needs improvement' : 'is poor'}`,
          recommendation: 'Optimize server response times, preload key resources, or implement image optimization'
        })
      }
    }

    if (metrics.cls !== null) {
      const rating = getPerformanceRating('cls', metrics.cls)
      if (rating !== 'good') {
        insights.push({
          type: 'warning',
          metric: 'CLS',
          message: `Cumulative Layout Shift (${metrics.cls.toFixed(3)}) ${rating === 'needs-improvement' ? 'needs improvement' : 'is poor'}`,
          recommendation: 'Add size attributes to images, avoid inserting content above existing content'
        })
      }
    }

    if (metrics.fps > 0 && metrics.fps < 30) {
      insights.push({
        type: 'error',
        metric: 'FPS',
        message: `Low frame rate detected (${metrics.fps} FPS)`,
        recommendation: 'Reduce JavaScript execution time, optimize animations, or implement performance optimizations'
      })
    }

    if (metrics.memoryUsage > 100) {
      insights.push({
        type: 'warning',
        metric: 'Memory',
        message: `High memory usage detected (${metrics.memoryUsage} MB)`,
        recommendation: 'Check for memory leaks, optimize large objects, or implement lazy loading'
      })
    }

    return insights
  }, [metrics])

  // Initialize monitoring on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      startMonitoring()
    }

    return () => {
      stopMonitoring()
    }
  }, [startMonitoring, stopMonitoring])

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    getInsights,
    getPerformanceRating: (metric: string, value: number) => getPerformanceRating(metric, value)
  }
}