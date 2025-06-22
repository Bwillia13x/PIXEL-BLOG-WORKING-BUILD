'use client'

import { useEffect } from 'react'
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals'

interface WebVitalsMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

function sendToAnalytics(metric: any) {
  const formattedMetric: WebVitalsMetric = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    timestamp: Date.now()
  }

  // Only send in production and avoid blocking main thread
  if (process.env.NODE_ENV === 'production') {
    // Use navigator.sendBeacon for better performance
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/web-vitals', JSON.stringify(formattedMetric))
    } else {
      // Fallback to fetch with low priority
      fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedMetric),
        priority: 'low'
      } as RequestInit).catch(() => {
        // Silently ignore analytics errors
      })
    }
  }
}

export default function WebVitalsMonitor() {
  useEffect(() => {
    // Delay initialization to not block initial render
    const timer = setTimeout(() => {
      try {
        onCLS(sendToAnalytics)
        onFCP(sendToAnalytics)
        onLCP(sendToAnalytics)
        onTTFB(sendToAnalytics)
      } catch (error) {
        // Silently ignore Web Vitals errors
        console.debug('Web Vitals initialization failed:', error)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // This component renders nothing to avoid any performance impact
  return null
}