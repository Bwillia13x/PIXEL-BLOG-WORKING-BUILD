"use client"

import { motion } from 'framer-motion'
import { Terminal } from 'lucide-react'

interface PixelLoadingProps {
  variant?: 'spinner' | 'dots' | 'bars' | 'pulse' | 'matrix' | 'typewriter'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  message?: string
  progress?: number // 0-100 for progress bars
}

export default function PixelLoading({ 
  variant = 'spinner', 
  size = 'md', 
  className = '',
  message
}: PixelLoadingProps) {
  const sizeConfig = {
    sm: { container: 'w-4 h-4', text: 'text-xs', icon: 'w-3 h-3' },
    md: { container: 'w-8 h-8', text: 'text-sm', icon: 'w-4 h-4' },
    lg: { container: 'w-12 h-12', text: 'text-base', icon: 'w-6 h-6' },
    xl: { container: 'w-16 h-16', text: 'text-lg', icon: 'w-8 h-8' }
  }

  const config = sizeConfig[size]

  const renderSpinner = () => (
    <div className={`${config.container} relative ${className}`}>
      {/* Outer rotating border */}
      <motion.div
        className="absolute inset-0 border-2 border-green-400/30 border-t-green-400 rounded-none"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Inner pulsing core */}
      <motion.div
        className="absolute inset-2 bg-green-400/20 rounded-none"
        animate={{ 
          opacity: [0.2, 0.8, 0.2],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Center pixel */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1 h-1 bg-green-400 rounded-none" />
      </div>
    </div>
  )

  const renderDots = () => (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : 'w-4 h-4'} bg-green-400 rounded-none`}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )

  const renderBars = () => (
    <div className={`flex items-end space-x-1 ${config.container} ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-1 bg-green-400 rounded-none"
          animate={{
            height: [`${20 + i * 10}%`, '100%', `${20 + i * 10}%`],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )

  const renderPulse = () => (
    <div className={`${config.container} relative ${className}`}>
      {/* Outer pulse rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 border border-green-400 rounded-none"
          animate={{
            scale: [1, 2.5],
            opacity: [0.8, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut"
          }}
        />
      ))}
      
      {/* Center core */}
      <motion.div
        className="absolute inset-2 bg-green-400 rounded-none"
        animate={{
          opacity: [0.4, 1, 0.4]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )

  const renderMatrix = () => (
    <div className={`${config.container} relative overflow-hidden ${className}`}>
      {/* Falling matrix lines */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute w-px bg-green-400 rounded-none"
          style={{
            left: `${i * 25}%`,
            height: '100%'
          }}
          animate={{
            y: ['-100%', '100%'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "linear"
          }}
        />
      ))}
      
      {/* Matrix characters */}
      <div className="absolute inset-0 flex items-center justify-center font-mono text-green-400 text-xs">
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          {'01'}
        </motion.span>
      </div>
    </div>
  )

  const renderTypewriter = () => (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Terminal className={`${config.icon} text-green-400`} />
      <div className="font-mono text-green-400">
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: 'auto' }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          █
        </motion.span>
      </div>
    </div>
  )

  const renderLoading = () => {
    switch (variant) {
      case 'dots':
        return renderDots()
      case 'bars':
        return renderBars()
      case 'pulse':
        return renderPulse()
      case 'matrix':
        return renderMatrix()
      case 'typewriter':
        return renderTypewriter()
      case 'spinner':
      default:
        return renderSpinner()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {renderLoading()}
      {message && (
        <motion.p
          className={`font-mono ${config.text} text-green-400/80 text-center`}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}

// Progress Bar Component
export function PixelProgressBar({ 
  progress = 0, 
  className = '', 
  showPercentage = true,
  animated = true,
  size = 'md',
  label 
}: {
  progress: number
  className?: string
  showPercentage?: boolean
  animated?: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: string
}) {
  const heightConfig = {
    sm: 'h-2',
    md: 'h-4', 
    lg: 'h-6'
  }

  const clampedProgress = Math.max(0, Math.min(100, progress))

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-sm text-green-400">{label}</span>
          {showPercentage && (
            <span className="font-mono text-xs text-green-400/80">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-700/50 border border-green-400/30 rounded-none ${heightConfig[size]} relative overflow-hidden`}>
        {/* Background grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(74, 222, 128, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(74, 222, 128, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '4px 4px'
          }}
        />
        
        {/* Progress fill */}
        <motion.div
          className="h-full bg-gradient-to-r from-green-600 to-green-400 relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ 
            duration: animated ? 0.8 : 0, 
            ease: "easeOut" 
          }}
        >
          {/* Animated shine effect */}
          {animated && clampedProgress > 0 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '200%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}
          
          {/* Pixel texture overlay */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%),
                linear-gradient(-45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.1) 75%),
                linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.1) 75%)
              `,
              backgroundSize: '2px 2px',
              backgroundPosition: '0 0, 0 1px, 1px -1px, -1px 0px'
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}

// Specialized loading components for common use cases
export function SpinnerLoading({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) {
  return <PixelLoading variant="spinner" size={size} className={className} />
}

export function DotsLoading({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) {
  return <PixelLoading variant="dots" size={size} className={className} />
}

export function MatrixLoading({ size = 'md', className = '', message }: { size?: 'sm' | 'md' | 'lg' | 'xl', className?: string, message?: string }) {
  return <PixelLoading variant="matrix" size={size} className={className} message={message} />
}

export function TypewriterLoading({ className = '', message = 'Processing...' }: { className?: string, message?: string }) {
  return <PixelLoading variant="typewriter" className={className} message={message} />
}