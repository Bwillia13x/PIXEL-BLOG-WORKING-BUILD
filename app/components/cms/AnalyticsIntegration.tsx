'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTheme } from '../Providers'

interface AnalyticsEvent {
  id: string
  type: 'page_view' | 'user_action' | 'performance' | 'engagement' | 'conversion' | 'error'
  category: string
  action: string
  label?: string
  value?: number
  userId?: string
  sessionId: string
  timestamp: Date
  metadata: Record<string, unknown>
  processed: boolean
}

interface ContentMetrics {
  postId: string
  views: number
  uniqueViews: number
  timeOnPage: number
  scrollDepth: number
  bounceRate: number
  shareCount: number
  commentCount: number
  likeCount: number
  conversionRate: number
  exitRate: number
  engagementScore: number
}

interface UserBehavior {
  userId: string
  sessionId: string
  entryPage: string
  exitPage: string
  pageViews: number
  sessionDuration: number
  actions: UserAction[]
  device: DeviceInfo
  location: LocationInfo
  referrer: string
  isReturning: boolean
}

interface UserAction {
  type: 'click' | 'scroll' | 'hover' | 'search' | 'download' | 'share' | 'like' | 'comment'
  element: string
  timestamp: Date
  coordinates?: { x: number; y: number }
  value?: string
}

interface DeviceInfo {
  type: 'desktop' | 'tablet' | 'mobile'
  os: string
  browser: string
  screenResolution: string
  viewportSize: string
}

interface LocationInfo {
  country?: string
  region?: string
  city?: string
  timezone: string
}

interface AnalyticsConfig {
  trackingId?: string
  enableRealtime: boolean
  enableHeatmaps: boolean
  enableUserRecording: boolean
  enableABTesting: boolean
  enableConversionTracking: boolean
  enableErrorTracking: boolean
  enablePerformanceTracking: boolean
  enableEngagementTracking: boolean
  samplingRate: number
  batchSize: number
  flushInterval: number
}

interface AnalyticsIntegrationProps {
  config?: Partial<AnalyticsConfig>
  postId?: string
  onMetricsUpdate?: (metrics: ContentMetrics) => void
  onEventCapture?: (event: AnalyticsEvent) => void
  className?: string
}

const DEFAULT_CONFIG: AnalyticsConfig = {
  enableRealtime: true,
  enableHeatmaps: false,
  enableUserRecording: false,
  enableABTesting: false,
  enableConversionTracking: true,
  enableErrorTracking: true,
  enablePerformanceTracking: true,
  enableEngagementTracking: true,
  samplingRate: 1.0,
  batchSize: 10,
  flushInterval: 30000 // 30 seconds
}

export default function AnalyticsIntegration({
  config = {},
  postId,
  onMetricsUpdate,
  onEventCapture,
  className = ''
}: AnalyticsIntegrationProps) {
  
  const [analyticsConfig] = useState<AnalyticsConfig>({ ...DEFAULT_CONFIG, ...config })
  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [metrics, setMetrics] = useState<ContentMetrics | null>(null)
  const [userBehavior, setUserBehavior] = useState<UserBehavior | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  
  const sessionId = useRef<string>(Math.random().toString(36).substr(2, 9))
  const userId = useRef<string>('')
  const startTime = useRef<number>(Date.now())
  const eventQueue = useRef<AnalyticsEvent[]>([])
  const flushTimer = useRef<NodeJS.Timeout | undefined>(undefined)
  const engagementTimer = useRef<NodeJS.Timeout | undefined>(undefined)

  // Helper functions
  const getDeviceInfo = (): DeviceInfo => {
    const userAgent = navigator.userAgent
    
    let deviceType: DeviceInfo['type'] = 'desktop'
    if (/Mobi|Android/i.test(userAgent)) deviceType = 'mobile'
    else if (/Tablet|iPad/i.test(userAgent)) deviceType = 'tablet'

    let os = 'Unknown'
    if (/Windows/i.test(userAgent)) os = 'Windows'
    else if (/Mac/i.test(userAgent)) os = 'macOS'
    else if (/Linux/i.test(userAgent)) os = 'Linux'
    else if (/Android/i.test(userAgent)) os = 'Android'
    else if (/iOS/i.test(userAgent)) os = 'iOS'

    let browser = 'Unknown'
    if (/Chrome/i.test(userAgent)) browser = 'Chrome'
    else if (/Firefox/i.test(userAgent)) browser = 'Firefox'
    else if (/Safari/i.test(userAgent)) browser = 'Safari'
    else if (/Edge/i.test(userAgent)) browser = 'Edge'

    return {
      type: deviceType,
      os,
      browser,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`
    }
  }

  const getLocationInfo = (): LocationInfo => {
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  }

  const calculateEngagementScore = (timeOnPage: number, scrollDepth: number): number => {
    // Simple engagement score calculation
    const timeScore = Math.min(timeOnPage / 60000, 1) // Cap at 1 minute
    const scrollScore = scrollDepth / 100
    const avgScore = (timeScore + scrollScore) / 2
    return Math.round(avgScore * 100)
  }

  const getScrollDepth = (): number => {
    const scrollTop = window.pageYOffset
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    return docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0
  }

  // Callback definitions (hoisted before useEffect)
  const trackEvent = useCallback((eventData: Omit<AnalyticsEvent, 'id' | 'sessionId' | 'timestamp' | 'processed'>) => {
    if (!isTracking || Math.random() > analyticsConfig.samplingRate) return

    const event: AnalyticsEvent = {
      id: Math.random().toString(36).substr(2, 9),
      sessionId: sessionId.current,
      timestamp: new Date(),
      processed: false,
      userId: userId.current,
      ...eventData
    }

    eventQueue.current.push(event)
    setEvents(prev => [...prev, event])

    if (onEventCapture) {
      onEventCapture(event)
    }

    // Auto-flush if queue is full
    if (eventQueue.current.length >= analyticsConfig.batchSize) {
      flushEvents()
    }
  }, [isTracking, analyticsConfig.samplingRate, analyticsConfig.batchSize, onEventCapture])

  const updateContentMetrics = useCallback((pageId: string) => {
    // Simulate metrics calculation
    const timeOnPage = Date.now() - startTime.current
    const scrollDepth = getScrollDepth()
    
    const newMetrics: ContentMetrics = {
      postId: pageId,
      views: (metrics?.views || 0) + 1,
      uniqueViews: 1, // Would need backend calculation
      timeOnPage,
      scrollDepth,
      bounceRate: timeOnPage < 30000 ? 1 : 0,
      shareCount: 0,
      commentCount: 0,
      likeCount: 0,
      conversionRate: 0,
      exitRate: 0,
      engagementScore: calculateEngagementScore(timeOnPage, scrollDepth)
    }

    setMetrics(newMetrics)

    if (onMetricsUpdate) {
      onMetricsUpdate(newMetrics)
    }
  }, [onMetricsUpdate, metrics?.views])

  const trackUserAction = useCallback((action: UserAction) => {
    trackEvent({
      type: 'user_action',
      category: 'interaction',
      action: action.type,
      label: action.element,
      metadata: {
        timestamp: action.timestamp.toISOString(),
        coordinates: action.coordinates
      }
    })

    setUserBehavior(prev => prev ? {
      ...prev,
      actions: [...prev.actions, action]
    } : null)
  }, [trackEvent])

  const trackPageView = useCallback((pageId: string) => {
    trackEvent({
      type: 'page_view',
      category: 'navigation',
      action: 'page_view',
      label: pageId,
      metadata: {
        url: window.location.href,
        title: document.title,
        referrer: document.referrer,
        timestamp: Date.now()
      }
    })

    // Update metrics
    updateContentMetrics(pageId)
  }, [trackEvent, updateContentMetrics])

  const trackEngagement = useCallback((type: string, value: number) => {
    trackEvent({
      type: 'engagement',
      category: 'content',
      action: type,
      value,
      metadata: {
        url: window.location.href,
        timestamp: Date.now()
      }
    })
  }, [trackEvent])

  const startEngagementTracking = useCallback(() => {
    // Track scroll events
    let scrollTimeout: NodeJS.Timeout
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        trackUserAction({
          type: 'scroll',
          element: 'page',
          timestamp: new Date()
        })
      }, 1000)
    }, { passive: true })

    // Track clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      trackUserAction({
        type: 'click',
        element: target.tagName.toLowerCase() + (target.id ? `#${target.id}` : ''),
        timestamp: new Date(),
        coordinates: { x: e.clientX, y: e.clientY }
      })
    })

    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      trackEvent({
        type: 'user_action',
        category: 'engagement',
        action: document.hidden ? 'tab_hidden' : 'tab_visible',
        metadata: { timestamp: Date.now() }
      })
    })
  }, [trackEvent, trackUserAction, trackEngagement])

  const initializeAnalytics = useCallback(() => {
    // Generate or retrieve user ID
    userId.current = localStorage.getItem('analytics_user_id') || Math.random().toString(36).substr(2, 9)
    localStorage.setItem('analytics_user_id', userId.current)

    // Initialize device info
    const deviceInfo = getDeviceInfo()
    const locationInfo = getLocationInfo()

    setUserBehavior({
      userId: userId.current,
      sessionId: sessionId.current,
      entryPage: window.location.pathname,
      exitPage: '',
      pageViews: 0,
      sessionDuration: 0,
      actions: [],
      device: deviceInfo,
      location: locationInfo,
      referrer: document.referrer,
      isReturning: localStorage.getItem('analytics_returning') === 'true'
    })

    localStorage.setItem('analytics_returning', 'true')
    setIsTracking(true)

    // Start flush timer
    if (analyticsConfig.flushInterval > 0) {
      flushTimer.current = setInterval(flushEvents, analyticsConfig.flushInterval)
    }

    // Track session start
    trackEvent({
      type: 'user_action',
      category: 'session',
      action: 'start',
      metadata: { deviceInfo, locationInfo }
    })
  }, [analyticsConfig.flushInterval, trackEvent])

  // Initialize analytics
  useEffect(() => {
    initializeAnalytics()
    
    if (analyticsConfig.enableEngagementTracking) {
      startEngagementTracking()
    }

    return () => {
      if (flushTimer.current) clearInterval(flushTimer.current)
      if (engagementTimer.current) clearInterval(engagementTimer.current)
      flushEvents()
    }
  }, [analyticsConfig.enableEngagementTracking, initializeAnalytics, startEngagementTracking])

  // Track page view when postId changes
  useEffect(() => {
    if (postId) {
      trackPageView(postId)
    }
  }, [postId, trackPageView])

  const trackError = useCallback((error: Error, context?: string) => {
    if (!analyticsConfig.enableErrorTracking) return

    trackEvent({
      type: 'error',
      category: 'error',
      action: 'javascript_error',
      label: error.message,
      metadata: {
        error: error.name,
        stack: error.stack,
        context,
        url: window.location.href
      }
    })
  }, [analyticsConfig.enableErrorTracking, trackEvent])

  const flushEvents = async () => {
    if (eventQueue.current.length === 0) return

    const eventsToFlush = [...eventQueue.current]
    eventQueue.current = []

    try {
      // Send to analytics endpoint
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          events: eventsToFlush,
          sessionId: sessionId.current,
          userId: userId.current,
          timestamp: Date.now()
        })
      })

      if (response.ok) {
        // Mark events as processed
        setEvents(prev => prev.map(event => 
          eventsToFlush.find(e => e.id === event.id) 
            ? { ...event, processed: true }
            : event
        ))
      } else {
        // Re-queue failed events
        eventQueue.current.unshift(...eventsToFlush)
      }
    } catch (error) {
      console.warn('Analytics flush failed:', error)
      // Re-queue failed events
      eventQueue.current.unshift(...eventsToFlush)
    }
  }

  const exportData = () => {
    const data = {
      events: events.slice(-100), // Last 100 events
      metrics,
      userBehavior,
      config: analyticsConfig,
      exportedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-data-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getEventTypeColor = (type: string): string => {
    switch (type) {
      case 'page_view': return '#10b981'
      case 'user_action': return '#3b82f6'
      case 'performance': return '#f59e0b'
      case 'engagement': return '#8b5cf6'
      case 'conversion': return '#ef4444'
      case 'error': return '#dc2626'
      default: return '#6b7280'
    }
  }

  // Global error tracking
  useEffect(() => {
    if (analyticsConfig.enableErrorTracking) {
      const handleError = (event: ErrorEvent) => {
        trackError(new Error(event.message), 'global_error_handler')
      }

      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        trackError(new Error(String(event.reason)), 'unhandled_promise_rejection')
      }

      window.addEventListener('error', handleError)
      window.addEventListener('unhandledrejection', handleUnhandledRejection)

      return () => {
        window.removeEventListener('error', handleError)
        window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      }
    }
  }, [analyticsConfig.enableErrorTracking, trackError])

  return (
    <div className={`${className}`}>
      {/* Analytics Status Indicator */}
      <div className="fixed bottom-4 left-4 z-40">
        <div className="flex items-center space-x-2">
          {/* Status Dot */}
          <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
          
          {/* Toggle Dashboard */}
          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className="px-3 py-2 bg-gray-900/90 border border-green-400/30 text-green-400 rounded font-mono text-xs hover:bg-gray-800/90 transition-colors"
          >
            📊 Analytics
          </button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {showDashboard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="pixel-border bg-gray-900/95 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-pixel text-lg text-green-400">Analytics Dashboard</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={exportData}
                  className="px-3 py-1 bg-blue-600/60 hover:bg-blue-500/60 text-white font-mono text-sm rounded transition-colors"
                >
                  📥 Export
                </button>
                <button
                  onClick={() => setShowDashboard(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Metrics Overview */}
            {metrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="pixel-border bg-gray-800/40 p-3 rounded text-center">
                  <div className="text-2xl text-green-400">{metrics.views}</div>
                  <div className="text-xs text-gray-400 font-mono">Page Views</div>
                </div>
                <div className="pixel-border bg-gray-800/40 p-3 rounded text-center">
                  <div className="text-2xl text-blue-400">{Math.round(metrics.timeOnPage / 1000)}s</div>
                  <div className="text-xs text-gray-400 font-mono">Time on Page</div>
                </div>
                <div className="pixel-border bg-gray-800/40 p-3 rounded text-center">
                  <div className="text-2xl text-yellow-400">{metrics.scrollDepth}%</div>
                  <div className="text-xs text-gray-400 font-mono">Scroll Depth</div>
                </div>
                <div className="pixel-border bg-gray-800/40 p-3 rounded text-center">
                  <div className="text-2xl text-purple-400">{metrics.engagementScore}</div>
                  <div className="text-xs text-gray-400 font-mono">Engagement</div>
                </div>
              </div>
            )}

            {/* Recent Events */}
            <div className="space-y-4">
              <h4 className="font-pixel text-green-400">Recent Events ({events.length})</h4>
              
              <div className="max-h-64 overflow-y-auto space-y-2">
                {events.slice(-20).reverse().map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-gray-800/40 rounded text-sm">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getEventTypeColor(event.type) }}
                      />
                      <div>
                        <div className="font-mono text-gray-200">
                          {event.category} • {event.action}
                        </div>
                        {event.label && (
                          <div className="text-xs text-gray-400">{event.label}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-gray-500 font-mono">
                        {event.timestamp.toLocaleTimeString()}
                      </div>
                      {event.processed && (
                        <div className="text-xs text-green-400">✓</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Configuration */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <h4 className="font-pixel text-green-400 mb-3">Configuration</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Tracking:</span>
                  <span className={isTracking ? 'text-green-400' : 'text-red-400'}>
                    {isTracking ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sampling:</span>
                  <span className="text-blue-400">{(analyticsConfig.samplingRate * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Queue:</span>
                  <span className="text-yellow-400">{eventQueue.current.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Session:</span>
                  <span className="text-purple-400">{sessionId.current.slice(0, 6)}...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}