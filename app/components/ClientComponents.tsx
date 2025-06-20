'use client'

import { lazy, Suspense } from 'react'

// Lazy load performance-heavy components
const FloatingPixels = lazy(() => import('./FloatingPixels'))
const SoundEffect = lazy(() => import('./SoundEffect'))
const RetroTerminal = lazy(() => import('./RetroTerminal'))

export function ClientComponents() {
  return (
    <Suspense fallback={null}>
      <FloatingPixels />
      <SoundEffect />
      <RetroTerminal />
    </Suspense>
  )
}

export default ClientComponents
