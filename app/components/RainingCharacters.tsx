"use client"

import type React from "react"
import { useState, useEffect, useRef, useMemo } from "react"
import { useTheme } from "next-themes"

interface Character {
  char: string
  x: number
  y: number
  speed: number
  opacity: number
  trail: Array<{ x: number; y: number; opacity: number }>
  glitch: boolean
  lifespan: number
  age: number
}

interface MatrixColumn {
  chars: string[]
  speeds: number[]
  x: number
  length: number
  headY: number
  active: boolean
}

class TextScramble {
  el: HTMLElement
  chars: string
  queue: Array<{
    from: string
    to: string
    start: number
    end: number
    char?: string
  }>
  frame: number
  frameRequest: number
  resolve: (value: void | PromiseLike<void>) => void

  constructor(el: HTMLElement) {
    this.el = el
    this.chars = '!<>-_\\/[]{}—=+*^?#01'
    this.queue = []
    this.frame = 0
    this.frameRequest = 0
    this.resolve = () => {}
    this.update = this.update.bind(this)
  }

  setText(newText: string) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise<void>((resolve) => this.resolve = resolve)
    this.queue = []
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
    }
    
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }

  update() {
    let output = ''
    let complete = 0
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      const { from, to, start, end } = this.queue[i]
      let { char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)]
          this.queue[i].char = char
        }
        output += `<span class="dud">${char}</span>`
      } else {
        output += from
      }
    }
    
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
}

// Separate component for just the scrambled title
export const ScrambledTitle: React.FC = () => {
  const elementRef = useRef<HTMLHeadingElement>(null)
  const scramblerRef = useRef<TextScramble | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (elementRef.current && !scramblerRef.current) {
      scramblerRef.current = new TextScramble(elementRef.current)
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    if (mounted && scramblerRef.current) {
      const phrases = [
        'Drew Williams',
        'Tech • Art • Finance',
        'Drew Williams',
        'Pixel Wisdom',
        'Drew Williams'
      ]
      
      let counter = 0
      const next = () => {
        if (scramblerRef.current) {
          scramblerRef.current.setText(phrases[counter]).then(() => {
            setTimeout(next, 3000) // Longer pause to read the text
          })
          counter = (counter + 1) % phrases.length
        }
      }

      next()
    }
  }, [mounted])

  return (
    <h1 
      ref={elementRef}
      className="text-green-400 text-4xl md:text-6xl font-pixel tracking-wider text-center"
      style={{ 
        fontFamily: 'var(--font-press-start-2p)', 
        textShadow: '2px 2px 0 #000, 0 0 10px rgba(74, 222, 128, 0.5)' 
      }}
    >
      Drew Williams
    </h1>
  )
}

interface RainingBackgroundProps {
  intensity?: 'low' | 'medium' | 'high'
  showTrails?: boolean
  enableGlitch?: boolean
  mouseInteraction?: boolean
}

// Enhanced full-page raining background component
export const RainingBackground: React.FC<RainingBackgroundProps> = ({
  intensity = 'medium',
  showTrails = true,
  enableGlitch = true,
  mouseInteraction = true
}) => {
  const { theme } = useTheme()
  const [columns, setColumns] = useState<MatrixColumn[]>([])
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const lastFrameTime = useRef<number>(0)
  const [mounted, setMounted] = useState(false)

  // Theme-aware colors
  const colors = useMemo(() => {
    if (!mounted) return { primary: '#4ade80', secondary: '#22c55e', dim: '#374151' }
    
    return theme === 'dark' ? {
      primary: '#4ade80',
      secondary: '#22c55e', 
      dim: '#374151',
      background: '#000000'
    } : {
      primary: '#059669',
      secondary: '#10b981',
      dim: '#9ca3af',
      background: '#ffffff'
    }
  }, [theme, mounted])

  const matrixChars = useMemo(() => {
    return [
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      '0123456789',
      'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
      '!@#$%^&*()_+-=[]{}|;:,.<>?',
      '▓▒░█▄▀■□▪▫'
    ].join('')
  }, [])

  const intensitySettings = useMemo(() => {
    const settings = {
      low: { charCount: 150, speed: 0.3, glitchChance: 0.001 },
      medium: { charCount: 300, speed: 0.5, glitchChance: 0.003 },
      high: { charCount: 500, speed: 0.8, glitchChance: 0.005 }
    }
    return settings[intensity]
  }, [intensity])

  // Mouse tracking
  useEffect(() => {
    if (!mouseInteraction) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseInteraction])

  // Initialize matrix columns
  useEffect(() => {
    setMounted(true)
    const columnWidth = 20
    const numColumns = Math.floor(window.innerWidth / columnWidth)
    
    const newColumns: MatrixColumn[] = []
    for (let i = 0; i < numColumns; i++) {
      const length = Math.floor(Math.random() * 20) + 5
      newColumns.push({
        chars: Array(length).fill(0).map(() => 
          matrixChars[Math.floor(Math.random() * matrixChars.length)]
        ),
        speeds: Array(length).fill(0).map(() => Math.random() * 2 + 0.5),
        x: i * columnWidth,
        length,
        headY: Math.random() * -500,
        active: Math.random() > 0.7
      })
    }
    
    setColumns(newColumns)
  }, [])

  // Canvas-based animation for better performance
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
      
      if (deltaTime >= 50) { // 20 FPS cap for performance
        // Clear canvas with fade effect
        ctx.fillStyle = theme === 'dark' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Update and draw columns
        setColumns(prevColumns => 
          prevColumns.map(column => {
            const newColumn = { ...column }
            
            // Update position
            newColumn.headY += intensitySettings.speed
            
            // Reset if off screen
            if (newColumn.headY > canvas.height + newColumn.length * 20) {
              newColumn.headY = Math.random() * -500
              newColumn.active = Math.random() > 0.6
              // Regenerate characters
              newColumn.chars = newColumn.chars.map(() => 
                matrixChars[Math.floor(Math.random() * matrixChars.length)]
              )
            }
            
            // Draw column if active
            if (newColumn.active) {
              ctx.font = '14px monospace'
              
              for (let i = 0; i < newColumn.length; i++) {
                const charY = newColumn.headY - (i * 20)
                
                if (charY > -20 && charY < canvas.height + 20) {
                  const opacity = i === 0 ? 1 : Math.max(0, 1 - (i / newColumn.length))
                  const isHead = i < 3
                  
                  // Mouse interaction effect
                  let distanceFromMouse = 1
                  if (mouseInteraction) {
                    const mouseX = (mousePos.x / 100) * canvas.width
                    const mouseY = (mousePos.y / 100) * canvas.height
                    const distance = Math.sqrt(
                      Math.pow(newColumn.x - mouseX, 2) + Math.pow(charY - mouseY, 2)
                    )
                    distanceFromMouse = Math.max(0.3, Math.min(1, distance / 150))
                  }
                  
                  // Color based on position and theme
                  if (isHead) {
                    ctx.fillStyle = `rgba(${theme === 'dark' ? '255, 255, 255' : '0, 0, 0'}, ${opacity * distanceFromMouse})`
                  } else {
                    const green = theme === 'dark' ? '74, 222, 128' : '5, 150, 105'
                    ctx.fillStyle = `rgba(${green}, ${opacity * 0.8 * distanceFromMouse})`
                  }
                  
                  // Glitch effect
                  if (enableGlitch && Math.random() < intensitySettings.glitchChance) {
                    newColumn.chars[i] = matrixChars[Math.floor(Math.random() * matrixChars.length)]
                  }
                  
                  ctx.fillText(newColumn.chars[i], newColumn.x, charY)
                }
              }
            }
            
            return newColumn
          })
        )
        
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
  }, [mounted, theme, matrixChars, intensitySettings, mousePos, mouseInteraction, enableGlitch])

  if (!mounted) {
    return <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0" />
  }

  return (
    <div 
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
      role="img"
      aria-label="Animated matrix-style background with falling characters"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          imageRendering: 'pixelated',
          filter: enableGlitch ? 'contrast(1.1) brightness(1.05)' : 'none'
        }}
        aria-hidden="true"
      />
      
      {/* Screen reader description */}
      <div className="sr-only">
        Decorative animated background featuring falling matrix-style characters 
        with {intensity} intensity. Background includes {showTrails ? 'character trails' : 'no trails'} 
        and {enableGlitch ? 'glitch effects' : 'no glitch effects'}.
      </div>
      
      {/* Optional overlay effects */}
      {showTrails && (
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, transparent 20%, ${colors.background} 80%)`
          }}
          aria-hidden="true"
        />
      )}

      <style jsx global>{`
        .dud {
          color: ${colors.primary};
          opacity: 0.7;
        }
      `}</style>
    </div>
  )
}

// Header component that includes both title and header-specific raining effect
const RainingCharacters: React.FC = () => {
  return (
    <div className="relative w-full h-64 overflow-hidden">
      {/* Title */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <ScrambledTitle />
      </div>
    </div>
  )
}

export default RainingCharacters 