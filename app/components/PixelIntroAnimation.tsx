"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export function PixelIntroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showInitialText, setShowInitialText] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    window.addEventListener("resize", resizeCanvas)

    // Pixel noise effect
    const createPixelNoise = () => {
      const idata = ctx.createImageData(canvas.width, canvas.height)
      const buffer32 = new Uint32Array(idata.data.buffer)
      const len = buffer32.length

      for (let i = 0; i < len; i++) {
        if (Math.random() < 0.03) {
          buffer32[i] = 0xff00ff00 // green pixels
        }
      }

      ctx.putImageData(idata, 0, 0)
    }

    // Matrix effect with pixel text
    const fontSize = 16
    const columns = canvas.width / fontSize
    const drops: number[] = []

    for (let i = 0; i < columns; i++) {
      drops[i] = 1
    }

    const pixelMatrix = () => {
      ctx.fillStyle = "rgba(17, 24, 39, 0.05)" // gray-900 with opacity
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#4ade80" // green-400
      ctx.font = `${fontSize}px "Press Start 2P", monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = "IT FROM BIT BLOG AI DEV TOOLS"[Math.floor(Math.random() * 26)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    // Pixel glitch effect
    let glitchInterval: NodeJS.Timeout | null = null

    const startPixelGlitching = () => {
      if (glitchInterval) clearInterval(glitchInterval)

      glitchInterval = setInterval(() => {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const width = Math.random() * 200 + 50
        const height = Math.random() * 16 + 8

        ctx.save()
        ctx.translate(x, y)
        ctx.scale(Math.random() > 0.5 ? 1 : -1, 1)

        // Get image data from a random part of the canvas
        const imageData = ctx.getImageData(Math.random() * canvas.width, Math.random() * canvas.height, width, height)

        // Draw it somewhere else with pixel effect
        ctx.putImageData(imageData, 0, 0)
        ctx.restore()
      }, 80)

      setTimeout(() => {
        if (glitchInterval) clearInterval(glitchInterval)
      }, 400)
    }

    // Animation sequence with enhanced phases
    let phase = 0
    let lastTime = 0
    let matrixStartTime = 0
    let noiseStartTime = 0
    let textStartTime = 0

    const animate = (time: number) => {
      if (!lastTime) lastTime = time
      lastTime = time

      if (phase === 0) {
        // Initial static/noise phase
        createPixelNoise()
        if (time > 600) {
          phase = 1
          matrixStartTime = time
        }
      } else if (phase === 1) {
        // Enhanced matrix phase
        pixelMatrix()
        if (time - matrixStartTime > 1200) {
          phase = 2
          textStartTime = time
          setShowInitialText(true)
        }
      } else if (phase === 2) {
        // Text reveal phase with matrix background
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Lighter matrix effect
        ctx.fillStyle = "rgba(74, 222, 128, 0.3)"
        ctx.font = `${fontSize}px "Press Start 2P", monospace`
        
        for (let i = 0; i < drops.length; i += 2) {
          const text = "ITFROMBIT"[Math.floor(Math.random() * 9)]
          ctx.fillText(text, i * fontSize, drops[i] * fontSize)
          drops[i] += 0.3
          
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.99) {
            drops[i] = 0
          }
        }
        
        if (time - textStartTime > 1000) {
          phase = 3
          noiseStartTime = time
        }
      } else if (phase === 3) {
        // Glitch transition phase
        createPixelNoise()
        if (Math.random() < 0.15) startPixelGlitching()

        // Fade to black
        const fadeOpacity = Math.min(1, (time - noiseStartTime) / 800)
        ctx.fillStyle = `rgba(0, 0, 0, ${fadeOpacity})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        if (time - noiseStartTime > 800) {
          phase = 4
        }
      } else if (phase === 4) {
        // Final black screen with minimal interference
        ctx.fillStyle = "rgba(0, 0, 0, 0.99)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        if (Math.random() < 0.01) startPixelGlitching()
      }

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
      if (glitchInterval) clearInterval(glitchInterval)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ imageRendering: 'pixelated' }} />
      
      {/* Initial text overlay */}
      {showInitialText && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              scale: [0.8, 1.1, 1, 0.9]
            }}
            transition={{ 
              duration: 2,
              times: [0, 0.3, 0.7, 1],
              ease: "easeInOut"
            }}
            className="text-center"
          >
            <div className="text-2xl md:text-4xl font-pixel text-green-400 mb-2"
                 style={{
                   textShadow: '0 0 20px rgba(74, 222, 128, 0.8), 2px 2px 0 #000'
                 }}>
              INITIALIZING
            </div>
            <div className="text-sm md:text-lg font-mono text-green-400/80">
              IT FROM BIT SYSTEMS
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-50" />
      
      {/* Scanlines */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(74, 222, 128, 0.1) 2px,
            rgba(74, 222, 128, 0.1) 4px
          )`
        }}
      />
    </>
  )
} 