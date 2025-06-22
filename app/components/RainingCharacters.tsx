"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "next-themes"


interface RainingCharactersProps {
  showTrails?: boolean
  intensity?: 'low' | 'medium' | 'high'
  interactive?: boolean
  performance?: 'auto' | 'optimized' | 'quality'
}

export default function RainingCharacters({ 
  showTrails = false, 
  intensity = 'low',
  interactive = false,
  performance = 'auto'
}: RainingCharactersProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [themeState, setThemeState] = useState<string | undefined>(undefined)
  const { theme } = useTheme()
  
  // Much more minimal element count - very subtle
  const elementCount = intensity === 'low' ? 1 : intensity === 'medium' ? 2 : 3

  // Minimal pixel noise function - very rare and subtle
  const createPixelNoise = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, density: number = 0.0003) => {
    if (Math.random() > 0.05) return // Very rare noise
    
    const idata = ctx.createImageData(canvas.width, canvas.height)
    const buffer32 = new Uint32Array(idata.data.buffer)
    const len = buffer32.length

    for (let i = 0; i < len; i++) {
      if (Math.random() < density) {
        buffer32[i] = 0x1a4ade80 // Very faint green pixels
      }
    }

    ctx.globalAlpha = 0.02 // Much more subtle
    ctx.putImageData(idata, 0, 0)
    ctx.globalAlpha = 1
  }, [])

  // Stabilize theme state with delay
  useEffect(() => {
    const timer = setTimeout(() => setThemeState(theme), 100)
    return () => clearTimeout(timer)
  }, [theme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set up canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Enhanced matrix characters with more variety
    const matrixChars = [
      "0", "1", ".", "·", ":", ";", "'", "`", "-", "_", "~", "+", "=",
      "ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ", "サ", "シ", "ス", "セ", "ソ", 
      "タ", "チ", "ツ", "テ", "ト", "ナ", "ニ", "ヌ", "ネ", "ノ", "ハ", "ヒ", "フ", "ヘ", "ホ",
      "マ", "ミ", "ム", "メ", "モ", "ヤ", "ユ", "ヨ", "ラ", "リ", "ル", "レ", "ロ", "ワ", "ヲ", "ン",
      "α", "β", "γ", "δ", "λ", "μ", "π", "σ", "Σ", "Φ", "Ψ", "Ω"
    ]
    
    // Character categories for variation
    const numericChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    const symbolChars = [".", "·", ":", ";", "'", "`", "-", "_", "~", "+", "=", "!", "@", "#", "$", "%"]
    const katakanaChars = matrixChars.filter(char => char.match(/[\u30A0-\u30FF]/))
    const greekChars = ["α", "β", "γ", "δ", "λ", "μ", "π", "σ", "Σ", "Φ", "Ψ", "Ω"]

    // Enhanced falling characters with more properties
    interface FallingCharacter {
      x: number
      y: number
      character: string
      speed: number
      opacity: number
      age: number
      maxAge: number
      category: 'numeric' | 'symbol' | 'katakana' | 'greek'
      baseSpeed: number
      glowIntensity: number
      size: number
    }
    
    // Function to get random character from category
    const getRandomCharFromCategory = (category: string): string => {
      switch (category) {
        case 'numeric': return numericChars[Math.floor(Math.random() * numericChars.length)]
        case 'symbol': return symbolChars[Math.floor(Math.random() * symbolChars.length)]
        case 'katakana': return katakanaChars[Math.floor(Math.random() * katakanaChars.length)]
        case 'greek': return greekChars[Math.floor(Math.random() * greekChars.length)]
        default: return matrixChars[Math.floor(Math.random() * matrixChars.length)]
      }
    }

    const characters: FallingCharacter[] = []
    
    // Create individual characters based on intensity
    const charSpacing = intensity === 'low' ? 100 : intensity === 'medium' ? 70 : 50
    const charCount = Math.floor(canvas.width / charSpacing) * 3 // Multiple rows
    
    const categories: ('numeric' | 'symbol' | 'katakana' | 'greek')[] = ['numeric', 'symbol', 'katakana', 'greek']
    
    for (let i = 0; i < charCount; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      const baseSpeed = 0.2 + Math.random() * 1.2 // Wider speed range
      
      characters.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height - 100, // Start above screen
        character: getRandomCharFromCategory(category),
        speed: baseSpeed,
        opacity: 0.03 + Math.random() * 0.07, // Very low opacity
        age: 0,
        maxAge: 20000 + Math.random() * 15000, // Long lifespan
        category,
        baseSpeed,
        glowIntensity: Math.random() * 0.05,
        size: 10 + Math.random() * 4 // Slight size variation
      })
    }

    // Performance monitoring
    let frameCount = 0
    let lastFPSCheck = 0
    let currentFPS = 60
    let adaptivePerformance = performance
    
    // Animation loop with performance optimization
    let lastTime = 0
    let noiseTimer = 0
    let animationId: number
    
    const animate = (time: number) => {
      if (!lastTime) lastTime = time
      const deltaTime = time - lastTime
      lastTime = time
      
      // FPS monitoring for auto performance adjustment
      frameCount++
      if (time - lastFPSCheck > 1000) {
        currentFPS = frameCount
        frameCount = 0
        lastFPSCheck = time
        
        // Auto-adjust performance based on FPS
        if (performance === 'auto') {
          if (currentFPS < 30 && adaptivePerformance !== 'optimized') {
            adaptivePerformance = 'optimized'
          } else if (currentFPS > 50 && adaptivePerformance !== 'quality') {
            adaptivePerformance = 'quality'
          }
        }
      }

      // Very gentle clearing for subtle trails
      if (showTrails) {
        const fadeAmount = 0.02 // Very slow fade for subtle effect
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeAmount})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }

      // Very minimal pixel noise
      if (adaptivePerformance !== 'optimized') {
        noiseTimer += deltaTime
        if (noiseTimer > 8000) { // Much less frequent
          if (Math.random() < 0.01) createPixelNoise(ctx, canvas, 0.0003)
          noiseTimer = 0
        }
      }

      // Update and draw individual characters with enhanced variations
      characters.forEach((char, index) => {
        // Variable speed with subtle fluctuations
        const speedMultiplier = 0.3 + Math.sin(char.age * 0.001) * 0.1 // Subtle speed variation
        char.y += char.speed * speedMultiplier
        char.age += deltaTime

        // Reset character when it goes off screen
        if (char.y > canvas.height + 20) {
          char.y = Math.random() * -200 - 50 // Start above screen
          char.x = Math.random() * canvas.width // Random x position
          char.age = 0
          // Regenerate character with same category preference
          char.character = getRandomCharFromCategory(char.category)
          char.speed = char.baseSpeed + (Math.random() - 0.5) * 0.3 // Slight speed variation
          char.opacity = 0.03 + Math.random() * 0.07
          char.glowIntensity = Math.random() * 0.05
        }

        // Skip if character is above or below visible area
        if (char.y < -20 || char.y > canvas.height + 20) return
        
        // Character variation based on category
        let displayChar = char.character
        if (Math.random() < 0.008) { // More frequent character changes
          displayChar = getRandomCharFromCategory(char.category)
        }
        
        // Set font size based on character size
        ctx.font = `${char.size}px 'Courier New', monospace`
        
        // Category-based coloring
        let color = "#22c55e" // Default green
        switch (char.category) {
          case 'numeric':
            color = "#10b981" // Emerald
            break
          case 'symbol':
            color = "#059669" // Darker green
            break
          case 'katakana':
            color = "#34d399" // Light green
            break
          case 'greek':
            color = "#6ee7b7" // Very light green
            break
        }
        
        ctx.fillStyle = color
        ctx.globalAlpha = Math.max(0, Math.min(0.15, char.opacity + char.glowIntensity))
        
        // Very subtle glow for some characters
        if (char.glowIntensity > 0.03) {
          ctx.shadowBlur = 2
          ctx.shadowColor = color
        } else {
          ctx.shadowBlur = 0
        }
        
        ctx.fillText(displayChar, char.x, char.y)
      })
      
      ctx.globalAlpha = 1

      // Smooth animation with performance throttling
      if (adaptivePerformance === 'optimized' && currentFPS < 30) {
        setTimeout(() => {
          animationId = requestAnimationFrame(animate)
        }, 33) // Cap at 30fps for low performance
      } else {
        animationId = requestAnimationFrame(animate)
      }
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [intensity, themeState, createPixelNoise, elementCount])

  return (
    <>
      {/* Main terminal canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ 
          imageRendering: 'auto',
          background: 'transparent',
          willChange: 'auto',
          opacity: 0.6 // Overall canvas opacity reduced
        }}
      />
      
      {/* Very subtle scanlines overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="w-full h-full opacity-5" // Much more subtle
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 3px,
              rgba(74, 222, 128, 0.05) 3px,
              rgba(74, 222, 128, 0.05) 6px
            )`
          }}
        />
      </div>

      {/* Barely visible screen effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-2" // Almost invisible
        style={{
          background: 'radial-gradient(ellipse at center, rgba(74, 222, 128, 0.02) 0%, transparent 70%)',
          animation: 'pulse 8s ease-in-out infinite alternate' // Much slower pulse
        }}
      />
    </>
  )
} 