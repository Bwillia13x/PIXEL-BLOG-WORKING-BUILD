"use client"

import dynamic from "next/dynamic"

// Lazy-load heavy canvas animations on client only
const RainingCharacters = dynamic(
  () => import("./RainingCharacters"),
  { ssr: false }
)

// Removed unused PixelMatrixRain dynamic import to prevent webpack chunk issues

interface ClientAnimationsProps {
  intensity?: 'low' | 'medium' | 'high'
  showTrails?: boolean
  interactive?: boolean
  performance?: 'auto' | 'optimized' | 'quality'
}

export function ClientAnimations({ 
  intensity = "low", 
  showTrails = false, 
  interactive = false, 
  performance = "optimized" 
}: ClientAnimationsProps) {
  return (
    <RainingCharacters
      intensity={intensity}
      showTrails={showTrails}
      interactive={interactive}
      performance={performance}
    />
  )
}

export default ClientAnimations 