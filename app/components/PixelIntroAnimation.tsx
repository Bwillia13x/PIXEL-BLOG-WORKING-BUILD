"use client"

import { useEffect, useRef } from "react"

export function PixelIntroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
        const text = "PIXEL WISDOM BLOG AI DEV TOOLS"[Math.floor(Math.random() * 30)]
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

    // Animation sequence
    let phase = 0
    let lastTime = 0
    let matrixStartTime = 0
    let noiseStartTime = 0

    const animate = (time: number) => {
      if (!lastTime) lastTime = time
      const deltaTime = time - lastTime
      lastTime = time

      if (phase === 0) {
        // Initial pixel noise phase
        createPixelNoise()
        if (time > 800) {
          phase = 1
          matrixStartTime = time
        }
      } else if (phase === 1) {
        // Pixel matrix phase
        pixelMatrix()
        if (time - matrixStartTime > 1800) {
          phase = 2
          noiseStartTime = time
        }
      } else if (phase === 2) {
        // Noise with occasional glitches
        createPixelNoise()
        if (Math.random() < 0.08) startPixelGlitching()

        // Fade to dark gray
        ctx.fillStyle = `rgba(17, 24, 39, ${Math.min(1, (time - noiseStartTime) / 800)})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        if (time - noiseStartTime > 800) {
          phase = 3
        }
      } else if (phase === 3) {
        // Final dark screen with minimal noise
        ctx.fillStyle = "rgba(17, 24, 39, 0.98)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        if (Math.random() < 0.02) startPixelGlitching()
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
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-30" />
    </>
  )
} 