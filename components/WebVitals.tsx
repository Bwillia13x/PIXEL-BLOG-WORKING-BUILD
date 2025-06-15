'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // In production, you'd send this to your analytics service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to analytics
      console.log('[Web Vitals]', metric)
      
      // Send to analytics service (uncomment when ready)
      // analytics.track('Web Vitals', {
      //   name: metric.name,
      //   value: metric.value,
      //   id: metric.id,
      //   url: window.location.href,
      // })
    }
  })

  return null
}

export default WebVitals
