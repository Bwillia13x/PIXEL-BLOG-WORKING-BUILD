"use client"

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import components that need client-side rendering with no SSR
const AccessibilityTester = dynamic(() => import('./AccessibilityTester'), {
  ssr: false,
  loading: () => null
})

const WebVitalsMonitor = dynamic(() => import('./WebVitalsMonitor'), {
  ssr: false,
  loading: () => null
})

export default function ClientComponents() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Only render client components after hydration
  if (!isMounted) {
    return null
  }

  return (
    <>
      {/* Development only components */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <AccessibilityTester />
          <WebVitalsMonitor />
        </>
      )}
    </>
  )
}
