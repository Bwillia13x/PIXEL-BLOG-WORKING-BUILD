"use client"

import React, { useEffect, useRef, useState, useMemo } from "react"
import { useTheme } from "next-themes"

interface GeometricOverlayProps {
  pattern?: 'grid' | 'triangles' | 'hexagons' | 'circuits' | 'waves'
  intensity?: 'subtle' | 'medium' | 'strong'
  animated?: boolean
  responsive?: boolean
  mouseInteraction?: boolean
}

interface Pattern {
  type: string
  x: number
  y: number
  size: number
  rotation: number
  opacity: number
  phase: number
}

export const GeometricOverlay: React.FC<GeometricOverlayProps> = ({
  pattern = 'grid',
  intensity = 'subtle',
  animated = true,
  responsive = true,
  mouseInteraction = false
}) => {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const patternsRef = useRef<Pattern[]>([])

  // Theme-aware styling
  const colors = useMemo(() => {
    if (!mounted) return { primary: '#4ade80', secondary: '#22c55e', accent: '#10b981' }
    
    return theme === 'dark' ? {
      primary: '#4ade80',
      secondary: '#22c55e', 
      accent: '#10b981',
      background: 'rgba(0, 0, 0, 0.02)'
    } : {
      primary: '#059669',
      secondary: '#047857',
      accent: '#065f46',
      background: 'rgba(255, 255, 255, 0.02)'
    }
  }, [theme, mounted])

  const intensitySettings = useMemo(() => {
    const settings = {
      subtle: { opacity: 0.05, density: 0.3, strokeWidth: 0.5 },
      medium: { opacity: 0.1, density: 0.6, strokeWidth: 1 },
      strong: { opacity: 0.2, density: 1, strokeWidth: 1.5 }
    }
    return settings[intensity]
  }, [intensity])

  // Mouse tracking
  useEffect(() => {
    if (!mouseInteraction) return

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (canvas) {
        const rect = canvas.getBoundingClientRect()
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseInteraction])

  // Initialize patterns
  useEffect(() => {
    setMounted(true)
    
    const initializePatterns = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const patterns: Pattern[] = []
      const density = intensitySettings.density
      
      switch (pattern) {
        case 'grid':
          const gridSize = 50 / density
          for (let x = 0; x < canvas.width; x += gridSize) {
            for (let y = 0; y < canvas.height; y += gridSize) {
              patterns.push({
                type: 'grid',
                x, y,
                size: gridSize,
                rotation: 0,
                opacity: Math.random() * intensitySettings.opacity,
                phase: Math.random() * Math.PI * 2
              })
            }
          }
          break

        case 'triangles':
          const triangleDensity = Math.floor(50 * density)
          for (let i = 0; i < triangleDensity; i++) {
            patterns.push({
              type: 'triangle',
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 30 + 10,
              rotation: Math.random() * Math.PI * 2,
              opacity: Math.random() * intensitySettings.opacity,
              phase: Math.random() * Math.PI * 2
            })
          }
          break

        case 'hexagons':
          const hexDensity = Math.floor(30 * density)
          for (let i = 0; i < hexDensity; i++) {
            patterns.push({
              type: 'hexagon',
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 25 + 15,
              rotation: Math.random() * Math.PI / 3,
              opacity: Math.random() * intensitySettings.opacity,
              phase: Math.random() * Math.PI * 2
            })
          }
          break

        case 'circuits':
          const circuitDensity = Math.floor(20 * density)
          for (let i = 0; i < circuitDensity; i++) {
            patterns.push({
              type: 'circuit',
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 40 + 20,
              rotation: (Math.floor(Math.random() * 4) * Math.PI) / 2, // 90-degree increments
              opacity: Math.random() * intensitySettings.opacity,
              phase: Math.random() * Math.PI * 2
            })
          }
          break

        case 'waves':
          const waveCount = Math.floor(8 * density)
          for (let i = 0; i < waveCount; i++) {
            patterns.push({
              type: 'wave',
              x: 0,
              y: (canvas.height / waveCount) * i,
              size: canvas.width,
              rotation: 0,
              opacity: Math.random() * intensitySettings.opacity,
              phase: Math.random() * Math.PI * 2
            })
          }
          break
      }
      
      patternsRef.current = patterns
    }

    initializePatterns()
  }, [pattern, intensitySettings, mounted])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !mounted) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let startTime = Date.now()

    const animate = () => {
      if (!ctx) return

      const currentTime = Date.now()
      const elapsed = (currentTime - startTime) / 1000

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw patterns
      patternsRef.current.forEach((patternItem) => {
        ctx.save()

        // Mouse interaction effect
        let mouseInfluence = 1
        if (mouseInteraction) {
          const distance = Math.sqrt(
            Math.pow(patternItem.x - mousePos.x, 2) + 
            Math.pow(patternItem.y - mousePos.y, 2)
          )
          mouseInfluence = Math.max(0.3, Math.min(2, 1 + (100 - Math.min(distance, 100)) / 100))
        }

        // Animation effects
        let opacity = patternItem.opacity
        let size = patternItem.size
        let rotation = patternItem.rotation

        if (animated) {
          opacity *= (0.5 + 0.5 * Math.sin(elapsed * 0.5 + patternItem.phase))
          size *= (0.9 + 0.1 * Math.sin(elapsed * 0.3 + patternItem.phase))
          rotation += elapsed * 0.1
        }

        opacity *= mouseInfluence
        size *= mouseInfluence

        ctx.globalAlpha = opacity
        ctx.strokeStyle = colors.primary
        ctx.lineWidth = intensitySettings.strokeWidth
        ctx.translate(patternItem.x, patternItem.y)
        ctx.rotate(rotation)

        // Draw different pattern types
        switch (patternItem.type) {
          case 'grid':
            ctx.strokeRect(-size/2, -size/2, size, size)
            break

          case 'triangle':
            ctx.beginPath()
            for (let i = 0; i < 3; i++) {
              const angle = (i * 2 * Math.PI) / 3
              const x = Math.cos(angle) * size
              const y = Math.sin(angle) * size
              if (i === 0) ctx.moveTo(x, y)
              else ctx.lineTo(x, y)
            }
            ctx.closePath()
            ctx.stroke()
            break

          case 'hexagon':
            ctx.beginPath()
            for (let i = 0; i < 6; i++) {
              const angle = (i * 2 * Math.PI) / 6
              const x = Math.cos(angle) * size
              const y = Math.sin(angle) * size
              if (i === 0) ctx.moveTo(x, y)
              else ctx.lineTo(x, y)
            }
            ctx.closePath()
            ctx.stroke()
            break

          case 'circuit':
            // Draw circuit-like patterns
            ctx.beginPath()
            ctx.moveTo(-size/2, 0)
            ctx.lineTo(-size/4, 0)
            ctx.lineTo(-size/4, -size/4)
            ctx.lineTo(size/4, -size/4)
            ctx.lineTo(size/4, 0)
            ctx.lineTo(size/2, 0)
            ctx.stroke()
            
            // Add connection dots
            ctx.fillStyle = colors.accent
            ctx.beginPath()
            ctx.arc(-size/2, 0, 2, 0, Math.PI * 2)
            ctx.arc(size/2, 0, 2, 0, Math.PI * 2)
            ctx.fill()
            break

          case 'wave':
            ctx.beginPath()
            for (let x = -size/2; x < size/2; x += 5) {
              const y = Math.sin((x / size) * Math.PI * 4 + elapsed + patternItem.phase) * 10
              if (x === -size/2) ctx.moveTo(x, y)
              else ctx.lineTo(x, y)
            }
            ctx.stroke()
            break
        }

        ctx.restore()
      })

      if (animated) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mounted, animated, colors, intensitySettings, mousePos, mouseInteraction])

  if (!mounted) {
    return <div className="fixed inset-0 pointer-events-none z-0" />
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: 0.6,
          mixBlendMode: theme === 'dark' ? 'screen' : 'multiply'
        }}
      />
    </div>
  )
}

export default GeometricOverlay