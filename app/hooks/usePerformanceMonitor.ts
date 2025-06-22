"use client"

import { useEffect, useRef, useState } from 'react'

interface PerformanceMetrics {
  fps: number
  memory: number
  isLowPerformance: boolean
  adaptiveQuality: 'low' | 'medium' | 'high'
}

export function usePerformanceMonitor(
  targetFPS: number = 60,
  lowPerformanceThreshold: number = 30
) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 0,
    isLowPerformance: false,
    adaptiveQuality: 'medium'
  })

  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()

    const measurePerformance = () => {
      frameCount++
      const currentTime = performance.now()

      // Calculate FPS every second
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        
        // Get memory usage if available
        const memory = (performance as any).memory?.usedJSHeapSize || 0

        // Determine performance level
        const isLowPerformance = fps < lowPerformanceThreshold
        let adaptiveQuality: 'low' | 'medium' | 'high' = 'medium'

        if (fps < 20) {
          adaptiveQuality = 'low'
        } else if (fps > 50) {
          adaptiveQuality = 'high'
        }

        setMetrics({
          fps,
          memory: Math.round(memory / 1024 / 1024), // Convert to MB
          isLowPerformance,
          adaptiveQuality
        })

        frameCount = 0
        lastTime = currentTime
      }

      rafIdRef.current = requestAnimationFrame(measurePerformance)
    }

    rafIdRef.current = requestAnimationFrame(measurePerformance)

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [lowPerformanceThreshold])

  return metrics
}

// Hook for throttling animations based on performance
export function useAnimationThrottle(targetFPS: number = 60) {
  const intervalRef = useRef<number>(1000 / targetFPS)
  const metrics = usePerformanceMonitor(targetFPS)

  useEffect(() => {
    // Adjust animation interval based on performance
    if (metrics.isLowPerformance) {
      intervalRef.current = 1000 / 30 // 30 FPS for low performance
    } else {
      intervalRef.current = 1000 / targetFPS
    }
  }, [metrics.isLowPerformance, targetFPS])

  return {
    interval: intervalRef.current,
    shouldThrottle: metrics.isLowPerformance,
    quality: metrics.adaptiveQuality
  }
}

// Hook for reducing particle count based on performance
export function useAdaptiveParticleCount(
  baseCount: number,
  performanceMultipliers: { low: number; medium: number; high: number } = {
    low: 0.3,
    medium: 0.7,
    high: 1.2
  }
) {
  const metrics = usePerformanceMonitor()

  const adaptiveCount = Math.round(
    baseCount * performanceMultipliers[metrics.adaptiveQuality]
  )

  return {
    count: adaptiveCount,
    quality: metrics.adaptiveQuality,
    isLowPerformance: metrics.isLowPerformance
  }
}