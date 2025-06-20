"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTheme } from "next-themes"
import { RainingBackground } from "./RainingCharacters"
import FloatingPixels from "./FloatingPixels"
import GeometricOverlay from "./GeometricOverlay"

interface DynamicBackgroundProps {
  layers?: {
    matrix?: boolean
    particles?: boolean
    geometric?: boolean
  }
  intensity?: 'low' | 'medium' | 'high'
  interactive?: boolean
  performance?: 'optimized' | 'balanced' | 'quality'
}

interface PerformanceSettings {
  maxFPS: number
  particleCount: number
  matrixIntensity: 'low' | 'medium' | 'high'
  enableTrails: boolean
  enableGlitch: boolean
  mouseInteraction: boolean
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  layers = { matrix: true, particles: true, geometric: false },
  intensity = 'medium',
  interactive = true,
  performance: performanceLevel = 'balanced'
}) => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [performanceMode, setPerformanceMode] = useState<'auto' | 'manual'>('auto')

  // Performance monitoring
  const [frameRate, setFrameRate] = useState(60)
  const [isLowPerformance, setIsLowPerformance] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Performance monitoring
    let frameCount = 0
    let lastTime = performance.now()
    
    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        setFrameRate(fps)
        setIsLowPerformance(fps < 30)
        frameCount = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(measureFPS)
    }
    
    const rafId = requestAnimationFrame(measureFPS)
    
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Performance-based settings
  const performanceSettings: PerformanceSettings = useMemo(() => {
    const baseSettings = {
      optimized: {
        maxFPS: 30,
        particleCount: 20,
        matrixIntensity: 'low' as const,
        enableTrails: false,
        enableGlitch: false,
        mouseInteraction: false
      },
      balanced: {
        maxFPS: 45,
        particleCount: 35,
        matrixIntensity: 'medium' as const,
        enableTrails: true,
        enableGlitch: true,
        mouseInteraction: true
      },
      quality: {
        maxFPS: 60,
        particleCount: 50,
        matrixIntensity: 'high' as const,
        enableTrails: true,
        enableGlitch: true,
        mouseInteraction: true
      }
    }

    // Auto-adjust based on performance
    if (performanceMode === 'auto' && isLowPerformance) {
      return baseSettings.optimized
    }
    
    return baseSettings[performanceLevel]
  }, [performanceLevel, isLowPerformance, performanceMode])

  // Visibility management for performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }
    
    const handleFocus = () => setIsVisible(true)
    const handleBlur = () => setIsVisible(false)
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  // Responsive design considerations
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Adjust settings for mobile
  const mobileOptimizedLayers = useMemo(() => {
    if (!isMobile) return layers
    
    return {
      matrix: layers.matrix,
      particles: false, // Disable particles on mobile for performance
      geometric: false  // Disable geometric patterns on mobile
    }
  }, [layers, isMobile])

  const mobileOptimizedSettings = useMemo(() => {
    if (!isMobile) return performanceSettings
    
    return {
      ...performanceSettings,
      particleCount: Math.floor(performanceSettings.particleCount / 2),
      enableTrails: false,
      mouseInteraction: false
    }
  }, [performanceSettings, isMobile])

  if (!mounted || !isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Performance indicator (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 z-50 bg-black/80 text-green-400 text-xs font-mono p-2 rounded">
          <div>FPS: {frameRate}</div>
          <div>Mode: {isLowPerformance ? 'Low Perf' : performanceLevel}</div>
          <div>Mobile: {isMobile ? 'Yes' : 'No'}</div>
        </div>
      )}

      {/* Matrix Rain Layer */}
      {mobileOptimizedLayers.matrix && (
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <RainingBackground
            intensity={mobileOptimizedSettings.matrixIntensity}
            showTrails={mobileOptimizedSettings.enableTrails}
            enableGlitch={mobileOptimizedSettings.enableGlitch}
            mouseInteraction={mobileOptimizedSettings.mouseInteraction && interactive}
          />
        </div>
      )}

      {/* Floating Particles Layer */}
      {mobileOptimizedLayers.particles && (
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          <FloatingPixels
            count={mobileOptimizedSettings.particleCount}
            mouseAttraction={mobileOptimizedSettings.mouseInteraction && interactive}
            showTrails={mobileOptimizedSettings.enableTrails}
            interactive={interactive}
            style="pixels"
          />
        </div>
      )}

      {/* Geometric Overlay Layer */}
      {mobileOptimizedLayers.geometric && (
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          <GeometricOverlay
            pattern="grid"
            intensity={intensity === 'high' ? 'medium' : 'subtle'}
            animated={!isLowPerformance}
            responsive={true}
            mouseInteraction={mobileOptimizedSettings.mouseInteraction && interactive}
          />
        </div>
      )}

      {/* Theme-aware overlay for better content readability */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: theme === 'dark' 
            ? 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.1) 100%)'
            : 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(255, 255, 255, 0.1) 100%)',
          zIndex: 4
        }}
      />
    </div>
  )
}

// Preset configurations for easy use
export const BackgroundPresets = {
  minimal: {
    layers: { matrix: true, particles: false, geometric: false },
    intensity: 'low' as const,
    performance: 'optimized' as const
  },
  
  standard: {
    layers: { matrix: true, particles: true, geometric: false },
    intensity: 'medium' as const,
    performance: 'balanced' as const
  },
  
  enhanced: {
    layers: { matrix: true, particles: true, geometric: true },
    intensity: 'high' as const,
    performance: 'quality' as const
  },
  
  particles: {
    layers: { matrix: false, particles: true, geometric: false },
    intensity: 'medium' as const,
    performance: 'balanced' as const
  },
  
  matrix: {
    layers: { matrix: true, particles: false, geometric: false },
    intensity: 'high' as const,
    performance: 'balanced' as const
  }
}

export default DynamicBackground