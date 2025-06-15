'use client'

import { lazy, Suspense } from 'react'

// Lazy load performance-heavy components
const FloatingPixels = lazy(() => import('./FloatingPixels'))
const SoundEffect = lazy(() => import('./SoundEffect'))

export function ClientComponents() {
  return (
    <Suspense fallback={null}>
      <FloatingPixels />
      <SoundEffect />
    </Suspense>
  )
}

export default ClientComponents
