"use client"

import { motion } from 'framer-motion'
import { useParallax } from '../hooks/useParallax'
import { useEffect, useState } from 'react'

interface ParallaxBackgroundProps {
  variant?: 'grid' | 'dots' | 'hexagons' | 'circuit' | 'matrix'
  intensity?: 'subtle' | 'moderate' | 'strong'
  className?: string
}

export default function ParallaxBackground({ 
  variant = 'grid', 
  intensity = 'subtle',
  className = '' 
}: ParallaxBackgroundProps) {
  const [isClient, setIsClient] = useState(false)
  
  // Different parallax speeds for layers
  const backgroundLayer = useParallax({ speed: 0.1, throttle: 8 })
  const midgroundLayer = useParallax({ speed: 0.3, throttle: 8 })
  const foregroundLayer = useParallax({ speed: 0.5, throttle: 8 })

  useEffect(() => {
    setIsClient(true)
  }, [])

  const intensityConfig = {
    subtle: { opacity: 0.03, scale: 1 },
    moderate: { opacity: 0.06, scale: 1.2 },
    strong: { opacity: 0.1, scale: 1.5 }
  }

  const config = intensityConfig[intensity]

  if (!isClient) {
    return null // Prevent SSR issues
  }

  const renderGridPattern = () => (
    <>
      {/* Background grid */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          ...backgroundLayer.style,
          opacity: config.opacity * 0.5
        }}
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(74, 222, 128, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(74, 222, 128, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: `scale(${config.scale})`
          }}
        />
      </motion.div>

      {/* Mid-layer grid */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          ...midgroundLayer.style,
          opacity: config.opacity * 0.7
        }}
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(74, 222, 128, 0.15) 2px, transparent 2px),
              linear-gradient(90deg, rgba(74, 222, 128, 0.15) 2px, transparent 2px)
            `,
            backgroundSize: '80px 80px',
            transform: `scale(${config.scale * 0.8})`
          }}
        />
      </motion.div>

      {/* Foreground accents */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          ...foregroundLayer.style,
          opacity: config.opacity
        }}
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(74, 222, 128, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(74, 222, 128, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '160px 160px',
            transform: `scale(${config.scale * 1.2})`
          }}
        />
      </motion.div>
    </>
  )

  const renderDotsPattern = () => (
    <>
      {/* Background dots */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          ...backgroundLayer.style,
          opacity: config.opacity * 0.4
        }}
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(74, 222, 128, 0.3) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
            transform: `scale(${config.scale})`
          }}
        />
      </motion.div>

      {/* Mid-layer dots */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          ...midgroundLayer.style,
          opacity: config.opacity * 0.6
        }}
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(74, 222, 128, 0.4) 2px, transparent 2px)`,
            backgroundSize: '60px 60px',
            backgroundPosition: '15px 15px',
            transform: `scale(${config.scale * 0.9})`
          }}
        />
      </motion.div>

      {/* Foreground dots */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          ...foregroundLayer.style,
          opacity: config.opacity
        }}
      >
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(74, 222, 128, 0.5) 1px, transparent 1px)`,
            backgroundSize: '120px 120px',
            backgroundPosition: '30px 30px',
            transform: `scale(${config.scale * 1.1})`
          }}
        />
      </motion.div>
    </>
  )

  const renderHexagonPattern = () => (
    <>
      {/* Hexagon pattern using CSS shapes */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          ...backgroundLayer.style,
          opacity: config.opacity * 0.5
        }}
      >
        <div className="w-full h-full">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-8 h-8 border border-green-400/20"
              style={{
                left: `${(i % 4) * 25}%`,
                top: `${Math.floor(i / 4) * 20}%`,
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                transform: `scale(${config.scale}) rotate(${i * 15}deg)`
              }}
            />
          ))}
        </div>
      </motion.div>
    </>
  )

  const renderCircuitPattern = () => (
    <>
      {/* Circuit board style lines */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          ...backgroundLayer.style,
          opacity: config.opacity * 0.3
        }}
      >
        <svg className="w-full h-full" style={{ transform: `scale(${config.scale})` }}>
          <defs>
            <pattern id="circuit-bg" patternUnits="userSpaceOnUse" width="100" height="100">
              <rect width="100" height="100" fill="transparent"/>
              <path d="M20 20 L80 20 L80 40 L60 40 L60 80 L40 80 L40 60 L20 60 Z" 
                    stroke="rgba(74, 222, 128, 0.1)" 
                    strokeWidth="1" 
                    fill="none"/>
              <circle cx="20" cy="20" r="2" fill="rgba(74, 222, 128, 0.2)"/>
              <circle cx="80" cy="40" r="2" fill="rgba(74, 222, 128, 0.2)"/>
              <circle cx="40" cy="80" r="2" fill="rgba(74, 222, 128, 0.2)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-bg)" />
        </svg>
      </motion.div>

      {/* Mid-layer circuit elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          ...midgroundLayer.style,
          opacity: config.opacity * 0.6
        }}
      >
        <svg className="w-full h-full" style={{ transform: `scale(${config.scale * 1.2})` }}>
          <defs>
            <pattern id="circuit-mid" patternUnits="userSpaceOnUse" width="150" height="150">
              <rect width="150" height="150" fill="transparent"/>
              <path d="M30 30 L120 30 L120 70 L90 70 L90 120 L60 120 L60 90 L30 90 Z" 
                    stroke="rgba(74, 222, 128, 0.15)" 
                    strokeWidth="2" 
                    fill="none"/>
              <rect x="25" y="25" width="10" height="10" fill="rgba(74, 222, 128, 0.2)" rx="2"/>
              <rect x="115" y="65" width="10" height="10" fill="rgba(74, 222, 128, 0.2)" rx="2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-mid)" />
        </svg>
      </motion.div>
    </>
  )

  const renderMatrixPattern = () => (
    <>
      {/* Matrix-style falling elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          ...backgroundLayer.style,
          opacity: config.opacity * 0.4
        }}
      >
        <div className="w-full h-full">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px bg-green-400/20"
              style={{
                left: `${(i * 7) % 100}%`,
                height: `${20 + (i % 3) * 10}%`,
                top: `${(i * 13) % 100}%`,
                transform: `scale(${config.scale})`
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scaleY: [1, 1.5, 1]
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Matrix characters */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          ...foregroundLayer.style,
          opacity: config.opacity * 0.8
        }}
      >
        <div className="w-full h-full font-mono text-xs text-green-400/20">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${(i * 12) % 100}%`,
                top: `${(i * 15) % 100}%`,
                transform: `scale(${config.scale * 0.8})`
              }}
              animate={{
                opacity: [0, 1, 0],
                y: [0, 50, 0]
              }}
              transition={{
                duration: 4 + (i % 2),
                repeat: Infinity,
                delay: i * 0.8,
                ease: "linear"
              }}
            >
              {['0', '1', 'ア', 'イ', 'ウ'][i % 5]}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  )

  const renderPattern = () => {
    switch (variant) {
      case 'dots':
        return renderDotsPattern()
      case 'hexagons':
        return renderHexagonPattern()
      case 'circuit':
        return renderCircuitPattern()
      case 'matrix':
        return renderMatrixPattern()
      case 'grid':
      default:
        return renderGridPattern()
    }
  }

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      {renderPattern()}
      
      {/* Subtle vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.1) 100%)`,
          opacity: config.opacity * 2
        }}
      />
    </div>
  )
}

// Specialized components for common use cases
export function GridParallax({ intensity = 'subtle', className = '' }: { intensity?: 'subtle' | 'moderate' | 'strong', className?: string }) {
  return <ParallaxBackground variant="grid" intensity={intensity} className={className} />
}

export function DotsParallax({ intensity = 'subtle', className = '' }: { intensity?: 'subtle' | 'moderate' | 'strong', className?: string }) {
  return <ParallaxBackground variant="dots" intensity={intensity} className={className} />
}

export function CircuitParallax({ intensity = 'subtle', className = '' }: { intensity?: 'subtle' | 'moderate' | 'strong', className?: string }) {
  return <ParallaxBackground variant="circuit" intensity={intensity} className={className} />
}

export function MatrixParallax({ intensity = 'subtle', className = '' }: { intensity?: 'subtle' | 'moderate' | 'strong', className?: string }) {
  return <ParallaxBackground variant="matrix" intensity={intensity} className={className} />
}