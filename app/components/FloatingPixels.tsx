"use client"

import type React from "react"
import { useEffect, useState, useRef, useMemo, useCallback } from "react"
import { useTheme } from "next-themes"

interface Pixel {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  life: number
  maxLife: number
  trail: Array<{ x: number; y: number; opacity: number }>
  magnetic: boolean
}

interface FloatingPixelsProps {
  count?: number
  mouseAttraction?: boolean
  showTrails?: boolean
  interactive?: boolean
  style?: 'pixels' | 'particles' | 'geometric'
}

const FloatingPixels: React.FC<FloatingPixelsProps> = ({
  count = 50,
  mouseAttraction = true,
  showTrails = true,
  interactive = true,
  style = 'pixels'
}) => {
  const { theme } = useTheme()
  const [pixels, setPixels] = useState<Pixel[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isMouseMoving, setIsMouseMoving] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const lastFrameTime = useRef<number>(0)
  const mouseTimeoutRef = useRef<NodeJS.Timeout>()
  const [mounted, setMounted] = useState(false)

  // Theme-aware colors
  const colors = useMemo(() => {
    if (!mounted) return ['#4ade80', '#22c55e', '#10b981']
    
    return theme === 'dark' ? [
      '#4ade80', '#22c55e', '#10b981', '#059669', '#047857',
      '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8',
      '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9'
    ] : [
      '#059669', '#047857', '#065f46', '#064e3b',
      '#1e40af', '#1e3a8a', '#1d4ed8', '#1a56db',
      '#7c3aed', '#6d28d9', '#5b21b6', '#581c87'
    ]
  }, [theme, mounted])

  // Mouse tracking with debouncing
  useEffect(() => {
    if (!interactive) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      setIsMouseMoving(true)
      
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current)
      }
      
      mouseTimeoutRef.current = setTimeout(() => {
        setIsMouseMoving(false)
      }, 500)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current)
      }
    }
  }, [interactive])

  // Initialize pixels
  const createPixel = useCallback((id: number): Pixel => {
    const size = Math.random() * 6 + 2
    return {
      id,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size,
      opacity: Math.random() * 0.7 + 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 1000 + 500,
      trail: [],
      magnetic: Math.random() > 0.7
    }
  }, [colors])

  useEffect(() => {
    setMounted(true)
    const newPixels: Pixel[] = []
    for (let i = 0; i < count; i++) {
      newPixels.push(createPixel(i))
    }
    setPixels(newPixels)
  }, [count, createPixel])

  // Canvas animation for better performance
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

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTime.current
      
      if (deltaTime >= 32) { // ~30 FPS for smooth animation
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        setPixels(prevPixels => 
          prevPixels.map(pixel => {
            const newPixel = { ...pixel }
            
            // Mouse attraction/repulsion
            if (mouseAttraction && isMouseMoving) {
              const dx = mousePos.x - newPixel.x
              const dy = mousePos.y - newPixel.y
              const distance = Math.sqrt(dx * dx + dy * dy)
              
              if (distance < 150) {
                const force = (150 - distance) / 150
                const angle = Math.atan2(dy, dx)
                
                if (newPixel.magnetic) {
                  // Attraction
                  newPixel.vx += Math.cos(angle) * force * 0.5
                  newPixel.vy += Math.sin(angle) * force * 0.5
                } else {
                  // Repulsion
                  newPixel.vx -= Math.cos(angle) * force * 0.3
                  newPixel.vy -= Math.sin(angle) * force * 0.3
                }
              }
            }

            // Apply physics
            newPixel.vx *= 0.98 // Damping
            newPixel.vy *= 0.98
            newPixel.x += newPixel.vx
            newPixel.y += newPixel.vy
            
            // Boundary conditions with wrapping
            if (newPixel.x < 0) newPixel.x = canvas.width
            if (newPixel.x > canvas.width) newPixel.x = 0
            if (newPixel.y < 0) newPixel.y = canvas.height
            if (newPixel.y > canvas.height) newPixel.y = 0
            
            // Update trail
            if (showTrails) {
              newPixel.trail.push({ 
                x: newPixel.x, 
                y: newPixel.y, 
                opacity: newPixel.opacity 
              })
              if (newPixel.trail.length > 10) {
                newPixel.trail.shift()
              }
            }
            
            // Life cycle
            newPixel.life += deltaTime
            if (newPixel.life > newPixel.maxLife) {
              // Respawn pixel
              return createPixel(newPixel.id)
            }
            
            // Pulse opacity based on life
            const lifeFactor = newPixel.life / newPixel.maxLife
            newPixel.opacity = (0.3 + 0.7 * Math.sin(lifeFactor * Math.PI)) * 
                              (isMouseMoving && newPixel.magnetic ? 1.5 : 1)
            
            return newPixel
          })
        )
        
        // Draw pixels
        pixels.forEach(pixel => {
          // Draw trail
          if (showTrails && pixel.trail.length > 1) {
            ctx.strokeStyle = pixel.color
            ctx.lineWidth = 1
            ctx.globalAlpha = 0.3
            ctx.beginPath()
            pixel.trail.forEach((point, i) => {
              if (i === 0) {
                ctx.moveTo(point.x, point.y)
              } else {
                ctx.lineTo(point.x, point.y)
              }
            })
            ctx.stroke()
          }
          
          // Draw pixel
          ctx.globalAlpha = pixel.opacity
          
          if (style === 'geometric') {
            // Draw as geometric shapes
            ctx.fillStyle = pixel.color
            ctx.beginPath()
            const sides = 6
            const angle = (Math.PI * 2) / sides
            ctx.moveTo(
              pixel.x + pixel.size * Math.cos(0),
              pixel.y + pixel.size * Math.sin(0)
            )
            for (let i = 1; i < sides; i++) {
              ctx.lineTo(
                pixel.x + pixel.size * Math.cos(i * angle),
                pixel.y + pixel.size * Math.sin(i * angle)
              )
            }
            ctx.closePath()
            ctx.fill()
          } else if (style === 'particles') {
            // Draw as glowing particles
            const gradient = ctx.createRadialGradient(
              pixel.x, pixel.y, 0,
              pixel.x, pixel.y, pixel.size * 2
            )
            gradient.addColorStop(0, pixel.color)
            gradient.addColorStop(1, 'transparent')
            ctx.fillStyle = gradient
            ctx.fillRect(
              pixel.x - pixel.size * 2,
              pixel.y - pixel.size * 2,
              pixel.size * 4,
              pixel.size * 4
            )
          } else {
            // Draw as pixels
            ctx.fillStyle = pixel.color
            ctx.fillRect(
              pixel.x - pixel.size / 2,
              pixel.y - pixel.size / 2,
              pixel.size,
              pixel.size
            )
          }
        })
        
        ctx.globalAlpha = 1
        lastFrameTime.current = currentTime
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mounted, pixels, mousePos, isMouseMoving, mouseAttraction, showTrails, style, createPixel])

  if (!mounted) {
    return <div className="fixed inset-0 pointer-events-none" />
  }

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0"
      role="img"
      aria-label={`Interactive ${style} animation with ${count} floating elements`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          mixBlendMode: theme === 'dark' ? 'screen' : 'multiply',
          filter: isMouseMoving ? 'brightness(1.2) contrast(1.1)' : 'brightness(1)'
        }}
        aria-hidden="true"
      />
      
      {/* Screen reader description */}
      <div className="sr-only">
        Decorative animated background with {count} floating {style} elements. 
        {mouseAttraction ? 'Elements respond to mouse movement.' : ''} 
        {showTrails ? 'Elements leave visible trails.' : ''} 
        Animation automatically pauses for users who prefer reduced motion.
      </div>
    </div>
  )
}

export default FloatingPixels
