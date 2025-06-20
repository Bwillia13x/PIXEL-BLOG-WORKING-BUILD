'use client'

import { useEffect, useRef, useState } from 'react'
import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals'

interface WebVitalData {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  entries: any[]
  id: string
  delta: number
}

interface WebVitalsState {
  cls: WebVitalData | null
  fid: WebVitalData | null
  fcp: WebVitalData | null
  lcp: WebVitalData | null
  ttfb: WebVitalData | null
  loading: boolean
  error: string | null
}

interface WebVitalsMonitorProps {
  debug?: boolean
  reportToAnalytics?: boolean
  showWidget?: boolean
  onMetric?: (metric: WebVitalData) => void
}

// Thresholds for Core Web Vitals
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 }
}

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS]
  if (!threshold) return 'good'
  
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

function formatValue(name: string, value: number): string {
  switch (name) {
    case 'CLS':
      return value.toFixed(3)
    case 'FID':
    case 'FCP':
    case 'LCP':
    case 'TTFB':
      return `${Math.round(value)}ms`
    default:
      return value.toString()
  }
}

function getMetricDescription(name: string): string {
  switch (name) {
    case 'CLS':
      return 'Cumulative Layout Shift - measures visual stability'
    case 'FID':
      return 'First Input Delay - measures interactivity'
    case 'FCP':
      return 'First Contentful Paint - measures loading performance'
    case 'LCP':
      return 'Largest Contentful Paint - measures loading performance'
    case 'TTFB':
      return 'Time to First Byte - measures server response time'
    default:
      return 'Web performance metric'
  }
}

interface MetricCardProps {
  metric: WebVitalData
  isExpanded: boolean
  onToggle: () => void
}

function MetricCard({ metric, isExpanded, onToggle }: MetricCardProps) {
  const ratingColors = {
    good: 'text-green-400 border-green-500/50 bg-green-500/10',
    'needs-improvement': 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10',
    poor: 'text-red-400 border-red-500/50 bg-red-500/10'
  }

  const ratingIcons = {
    good: '✓',
    'needs-improvement': '⚠',
    poor: '✗'
  }

  return (
    <div className={`pixel-border p-2 ${ratingColors[metric.rating]} cursor-pointer`} onClick={onToggle}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs font-bold">{metric.name}</span>
          <span className="text-xs">{ratingIcons[metric.rating]}</span>
        </div>
        <span className="font-mono text-xs">{formatValue(metric.name, metric.value)}</span>
      </div>
      
      {isExpanded && (
        <div className="mt-2 pt-2 border-t border-current/20">
          <div className="text-xs opacity-75 mb-1">{getMetricDescription(metric.name)}</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>ID: {metric.id.slice(0, 8)}</div>
            <div>Δ: {formatValue(metric.name, metric.delta)}</div>
          </div>
          {metric.entries.length > 0 && (
            <div className="mt-1 text-xs opacity-50">
              {metric.entries.length} measurement{metric.entries.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface PerformanceInsightsProps {
  vitals: WebVitalsState
}

function PerformanceInsights({ vitals }: PerformanceInsightsProps) {
  const metrics = Object.values(vitals).filter((v): v is WebVitalData => 
    v !== null && typeof v === 'object' && 'name' in v
  )

  const goodCount = metrics.filter(m => m.rating === 'good').length
  const totalCount = metrics.length
  const score = totalCount > 0 ? Math.round((goodCount / totalCount) * 100) : 0

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const recommendations = []
  
  if (vitals.lcp && vitals.lcp.rating !== 'good') {
    recommendations.push('Optimize images and server response time to improve LCP')
  }
  
  if (vitals.cls && vitals.cls.rating !== 'good') {
    recommendations.push('Add size attributes to images and avoid dynamic content injection')
  }
  
  if (vitals.fid && vitals.fid.rating !== 'good') {
    recommendations.push('Reduce JavaScript execution time and optimize event handlers')
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-bold text-white">Performance Score</span>
        <span className={`font-mono text-lg font-bold ${getScoreColor(score)}`}>
          {score}%
        </span>
      </div>
      
      {recommendations.length > 0 && (
        <div className="space-y-2">
          <span className="font-mono text-xs text-gray-400">Recommendations:</span>
          {recommendations.map((rec, index) => (
            <div key={index} className="text-xs text-gray-300 pl-2 border-l border-gray-600">
              {rec}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function WebVitalsMonitor({
  debug = false,
  reportToAnalytics = true,
  showWidget = false,
  onMetric
}: WebVitalsMonitorProps) {
  const [vitals, setVitals] = useState<WebVitalsState>({
    cls: null,
    fid: null,
    fcp: null,
    lcp: null,
    ttfb: null,
    loading: true,
    error: null
  })

  const [expandedMetric, setExpandedMetric] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const reportedMetrics = useRef<Set<string>>(new Set())

  const handleMetric = (metric: Metric) => {
    const webVitalData: WebVitalData = {
      name: metric.name,
      value: metric.value,
      rating: getRating(metric.name, metric.value),
      entries: metric.entries || [],
      id: metric.id,
      delta: metric.delta
    }

    setVitals(prev => ({
      ...prev,
      [metric.name.toLowerCase()]: webVitalData,
      loading: false
    }))

    // Report to analytics (only once per metric)
    if (reportToAnalytics && !reportedMetrics.current.has(metric.id)) {
      reportedMetrics.current.add(metric.id)
      
      // Send to analytics service
      if (typeof window !== 'undefined' && 'gtag' in window) {
        ;(window as any).gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: metric.name,
          value: Math.round(metric.value),
          custom_map: {
            metric_id: metric.id,
            metric_rating: webVitalData.rating
          }
        })
      }

      // Send to custom analytics endpoint
      if (typeof window !== 'undefined') {
        fetch('/api/analytics/web-vitals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            metric: webVitalData,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
          })
        }).catch(error => {
          if (debug) {
            console.warn('Failed to report web vitals:', error)
          }
        })
      }
    }

    // Call custom handler
    if (onMetric) {
      onMetric(webVitalData)
    }

    if (debug) {
      console.log(`[Web Vitals] ${metric.name}:`, webVitalData)
    }
  }

  useEffect(() => {
    try {
      // Measure Core Web Vitals
      getCLS(handleMetric)
      getFID(handleMetric)
      getFCP(handleMetric)
      getLCP(handleMetric)
      getTTFB(handleMetric)

      // Set loading to false after a timeout
      const timer = setTimeout(() => {
        setVitals(prev => ({ ...prev, loading: false }))
      }, 5000)

      return () => clearTimeout(timer)
    } catch (error) {
      console.error('[Web Vitals] Error measuring vitals:', error)
      setVitals(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }))
    }
  }, [debug, reportToAnalytics])

  // Keyboard shortcut to toggle widget
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'V') {
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Don't render anything if not in debug mode and widget is disabled
  if (!debug && !showWidget && !isVisible) {
    return null
  }

  const metrics = Object.values(vitals).filter((v): v is WebVitalData => 
    v !== null && typeof v === 'object' && 'name' in v
  )

  return (
    <>
      {/* Debug widget */}
      {(showWidget || isVisible) && (
        <div className="fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)]">
          <div className="pixel-border bg-gray-900/95 backdrop-blur-md p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-sm font-bold text-green-400">Web Vitals</h3>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white text-xs"
                title="Close (Ctrl+Shift+V to reopen)"
              >
                ✕
              </button>
            </div>

            {vitals.loading && (
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono">Measuring performance...</span>
              </div>
            )}

            {vitals.error && (
              <div className="text-red-400 text-xs font-mono">
                Error: {vitals.error}
              </div>
            )}

            {metrics.length > 0 && (
              <div className="space-y-2">
                {metrics.map(metric => (
                  <MetricCard
                    key={metric.name}
                    metric={metric}
                    isExpanded={expandedMetric === metric.name}
                    onToggle={() => setExpandedMetric(
                      expandedMetric === metric.name ? null : metric.name
                    )}
                  />
                ))}
              </div>
            )}

            {metrics.length >= 3 && (
              <div className="pt-2 border-t border-gray-700">
                <PerformanceInsights vitals={vitals} />
              </div>
            )}

            <div className="text-xs text-gray-500 text-center">
              Press Ctrl+Shift+V to toggle
            </div>
          </div>
        </div>
      )}

      {/* Console logging for debug mode */}
      {debug && typeof window !== 'undefined' && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.group('🚀 Web Vitals Monitor');
              console.log('Debug mode enabled');
              console.log('Press Ctrl+Shift+V to toggle widget');
              console.log('Metrics will be logged as they are measured');
              console.groupEnd();
            `
          }}
        />
      )}
    </>
  )
}

// Hook for accessing web vitals data
export function useWebVitals() {
  const [vitals, setVitals] = useState<Record<string, WebVitalData>>({})

  useEffect(() => {
    const handleMetric = (metric: Metric) => {
      const webVitalData: WebVitalData = {
        name: metric.name,
        value: metric.value,
        rating: getRating(metric.name, metric.value),
        entries: metric.entries || [],
        id: metric.id,
        delta: metric.delta
      }

      setVitals(prev => ({
        ...prev,
        [metric.name]: webVitalData
      }))
    }

    getCLS(handleMetric)
    getFID(handleMetric)
    getFCP(handleMetric)
    getLCP(handleMetric)
    getTTFB(handleMetric)
  }, [])

  return vitals
}

// Performance observer for additional metrics
export function usePerformanceObserver() {
  const [entries, setEntries] = useState<PerformanceEntry[]>([])

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return
    }

    const observer = new PerformanceObserver((list) => {
      setEntries(prev => [...prev, ...list.getEntries()])
    })

    try {
      observer.observe({ entryTypes: ['navigation', 'resource', 'paint', 'layout-shift'] })
    } catch (error) {
      console.warn('PerformanceObserver not supported:', error)
    }

    return () => observer.disconnect()
  }, [])

  return entries
}