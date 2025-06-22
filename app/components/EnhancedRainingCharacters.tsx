"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

interface EnhancedRainingCharactersProps {
  showTrails?: boolean
  intensity?: 'low' | 'medium' | 'high'
  interactive?: boolean
}

export default function EnhancedRainingCharacters({ 
  showTrails = true, 
  intensity = 'medium',
  interactive = true
}: EnhancedRainingCharactersProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [themeState, setThemeState] = useState<string | undefined>(undefined)
  const { theme } = useTheme()
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number | null>(null)

  // Stabilize theme state with delay
  useEffect(() => {
    const timer = setTimeout(() => setThemeState(theme), 100)
    return () => clearTimeout(timer)
  }, [theme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    // Set up canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Enhanced character sets for different visual styles
    const characterSets = {
      matrix: ['0', '1', 'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', 'サ', 'シ', 'ス', 'セ', 'ソ'],
      code: ['{', '}', '[', ']', '(', ')', '<', '>', '/', '\\', '|', '=', '+', '-', '*', '&', '%', '$', '#', '@'],
      terminal: ['$', '>', '_', '-', '=', '~', '#', '*', '+', '|', '\\', '/', '^', '&', '%'],
      binary: ['0', '1', '00', '01', '10', '11', '000', '001', '010', '011', '100', '101', '110', '111']
    }

    const characters = characterSets.matrix

    // Enhanced particle system
    interface RainDrop {
      x: number
      y: number
      z: number // Depth for 3D effect
      speed: number
      baseSpeed: number
      opacity: number
      maxOpacity: number
      char: string
      color: string
      life: number
      maxLife: number
      rotation: number
      rotationSpeed: number
      scale: number
      trail: Array<{ x: number; y: number; opacity: number }>
      glitchTimer: number
      originalChar: string
      gravity: number
      wind: number
      phase: number // For sine wave movement
      amplitude: number
    }

    const rainDrops: RainDrop[] = []
    const maxDrops = intensity === 'low' ? 50 : intensity === 'medium' ? 100 : 200
    const colors = ['#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534']

    // Create initial rain drops
    for (let i = 0; i < maxDrops; i++) {
      const char = characters[Math.floor(Math.random() * characters.length)]
      rainDrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        z: Math.random() * 0.8 + 0.2, // 0.2 to 1.0 depth
        speed: 0,
        baseSpeed: Math.random() * 3 + 1,
        opacity: 0,
        maxOpacity: Math.random() * 0.8 + 0.2,
        char: char,
        originalChar: char,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: Math.random() * 3000 + 2000,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        scale: Math.random() * 0.5 + 0.5,
        trail: [],
        glitchTimer: 0,
        gravity: Math.random() * 0.1 + 0.05,
        wind: (Math.random() - 0.5) * 0.5,
        phase: Math.random() * Math.PI * 2,
        amplitude: Math.random() * 20 + 5
      })
    }

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    // Physics and visual effects
    let lastTime = 0
    let globalTime = 0

    const animate = (time: number) => {
      if (!lastTime) lastTime = time
      const deltaTime = time - lastTime
      lastTime = time
      globalTime += deltaTime * 0.001

      // Dynamic canvas clearing for trails
      if (showTrails) {
        // Create trailing effect with gradual fade
        ctx.fillStyle = "rgba(0, 0, 0, 0.02)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }

      // Update and draw rain drops
      rainDrops.forEach((drop, index) => {
        // Enhanced physics
        drop.life += deltaTime
        drop.glitchTimer += deltaTime

        // Calculate depth-based properties
        const depthScale = 0.3 + (drop.z * 0.7)
        const fontSize = 12 * depthScale * drop.scale
        
        // Enhanced movement with wind, gravity, and sine wave
        drop.speed = drop.baseSpeed * drop.z + drop.gravity * (drop.life / 100)
        drop.y += drop.speed
        
        // Add wind effect
        drop.x += drop.wind + Math.sin(globalTime + drop.phase) * drop.amplitude * 0.01
        
        // Mouse interaction - particles avoid cursor
        if (interactive) {
          const mouseDistance = Math.sqrt(
            Math.pow(drop.x - mouseRef.current.x, 2) + 
            Math.pow(drop.y - mouseRef.current.y, 2)
          )
          
          if (mouseDistance < 100) {
            const pushStrength = (100 - mouseDistance) / 100
            const angle = Math.atan2(drop.y - mouseRef.current.y, drop.x - mouseRef.current.x)
            drop.x += Math.cos(angle) * pushStrength * 2
            drop.y += Math.sin(angle) * pushStrength * 2
            drop.opacity = Math.max(0.1, drop.opacity - pushStrength * 0.5)
          }
        }

        // Screen wrapping with buffer
        if (drop.x < -50) drop.x = canvas.width + 50
        if (drop.x > canvas.width + 50) drop.x = -50

        // Reset when off screen or life expired
        if (drop.y > canvas.height + 50 || drop.life > drop.maxLife) {
          drop.x = Math.random() * canvas.width
          drop.y = -50 - Math.random() * 100
          drop.life = 0
          drop.opacity = 0
          drop.char = drop.originalChar
          drop.baseSpeed = Math.random() * 3 + 1
          drop.z = Math.random() * 0.8 + 0.2
        }

        // Fade in/out based on life cycle
        const fadeInTime = 500
        const fadeOutTime = drop.maxLife - 1000
        
        if (drop.life < fadeInTime) {
          drop.opacity = (drop.life / fadeInTime) * drop.maxOpacity
        } else if (drop.life > fadeOutTime) {
          drop.opacity = drop.maxOpacity * (1 - (drop.life - fadeOutTime) / 1000)
        } else {
          drop.opacity = drop.maxOpacity
        }

        // Glitch effect
        if (drop.glitchTimer > 2000 && Math.random() < 0.02) {
          drop.char = characters[Math.floor(Math.random() * characters.length)]
          setTimeout(() => {
            drop.char = drop.originalChar
          }, 100)
          drop.glitchTimer = 0
        }

        // Update trail
        if (showTrails && drop.trail.length < 5) {
          drop.trail.push({ x: drop.x, y: drop.y, opacity: drop.opacity })
          if (drop.trail.length > 5) {
            drop.trail.shift()
          }
        }

        // Update rotation
        drop.rotation += drop.rotationSpeed

        // Draw trail
        if (showTrails && drop.trail.length > 1) {
          drop.trail.forEach((point, i) => {
            const trailOpacity = point.opacity * (i / drop.trail.length) * 0.5
            ctx.globalAlpha = trailOpacity
            ctx.fillStyle = drop.color
            ctx.font = `${fontSize * 0.8}px 'Courier New', monospace`
            ctx.fillText(drop.char, point.x, point.y)
          })
        }

        // Draw main drop
        ctx.save()
        ctx.globalAlpha = Math.max(0, drop.opacity)
        ctx.fillStyle = drop.color
        ctx.font = `${fontSize}px 'Courier New', monospace`
        
        // Apply rotation and scaling
        ctx.translate(drop.x, drop.y)
        ctx.rotate(drop.rotation)
        ctx.scale(depthScale, depthScale)
        
        // Add glow effect for enhanced visual appeal
        ctx.shadowColor = drop.color
        ctx.shadowBlur = 3 * depthScale
        ctx.fillText(drop.char, 0, 0)
        
        // Additional glow layer
        ctx.shadowBlur = 8 * depthScale
        ctx.globalAlpha = Math.max(0, drop.opacity * 0.3)
        ctx.fillText(drop.char, 0, 0)
        
        ctx.restore()
      })

      // Add atmospheric effects
      if (Math.random() < 0.005) {
        // Lightning-like flash effect
        ctx.globalAlpha = 0.1
        ctx.fillStyle = '#4ade80'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      // Scanline effect
      ctx.globalAlpha = 0.05
      for (let i = 0; i < canvas.height; i += 4) {
        ctx.fillStyle = i % 8 === 0 ? '#4ade80' : 'transparent'
        ctx.fillRect(0, i, canvas.width, 1)
      }

      ctx.globalAlpha = 1
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [intensity, showTrails, interactive, themeState])

  return (
    <>
      {/* Enhanced rainfall canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{ 
          imageRendering: 'pixelated',
          background: 'transparent',
          mixBlendMode: themeState === 'dark' ? 'screen' : 'multiply'
        }}
      />
      
      {/* Enhanced scanlines overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="w-full h-full opacity-5"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(74, 222, 128, 0.1) 2px,
              rgba(74, 222, 128, 0.1) 4px
            )`,
            animation: 'pulse 4s ease-in-out infinite alternate'
          }}
        />
      </div>

      {/* Atmospheric glow */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-10"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(74, 222, 128, 0.15) 0%, transparent 70%)',
          animation: 'pulse 6s ease-in-out infinite alternate'
        }}
      />
    </>
  )
}