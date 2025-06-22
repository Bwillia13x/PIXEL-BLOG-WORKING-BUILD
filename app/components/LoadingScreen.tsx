"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import PixelLoading, { PixelProgressBar } from './PixelLoading'

interface LoadingScreenProps {
  variant?: 'full' | 'overlay' | 'inline'
  message?: string
  progress?: number
  showProgress?: boolean
  className?: string
}

export default function LoadingScreen({ 
  variant = 'full',
  message = 'Loading...',
  progress,
  showProgress = false,
  className = '' 
}: LoadingScreenProps) {
  const [dots, setDots] = useState('')

  // Animated dots for loading message
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    
    return () => clearInterval(interval)
  }, [])

  const loadingContent = (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Main loading animation */}
      <div className="relative">
        <PixelLoading variant="matrix" size="xl" />
        
        {/* Surrounding pixel effects */}
        <div className="absolute -inset-8">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-green-400 rounded-none"
              style={{
                left: `${50 + 40 * Math.cos(i * Math.PI / 4)}%`,
                top: `${50 + 40 * Math.sin(i * Math.PI / 4)}%`
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading message */}
      <div className="text-center space-y-2">
        <motion.h2 
          className="font-pixel text-xl text-green-400"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {message}{dots}
        </motion.h2>
        
        <motion.p
          className="font-mono text-sm text-green-400/60"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Please wait while we prepare your experience
        </motion.p>
      </div>

      {/* Progress bar */}
      {showProgress && typeof progress === 'number' && (
        <div className="w-64">
          <PixelProgressBar 
            progress={progress} 
            size="md" 
            animated={true}
            showPercentage={true}
          />
        </div>
      )}

      {/* Pixel art decoration */}
      <div className="mt-8 grid grid-cols-8 gap-1">
        {[...Array(64)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 h-1 bg-green-400/20 rounded-none"
            animate={{
              opacity: [0.1, 0.6, 0.1],
              backgroundColor: [
                'rgba(74, 222, 128, 0.1)',
                'rgba(74, 222, 128, 0.4)',
                'rgba(74, 222, 128, 0.1)'
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: (i % 8) * 0.1 + Math.floor(i / 8) * 0.05,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  )

  if (variant === 'full') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}
      >
        {loadingContent}
      </motion.div>
    )
  }

  if (variant === 'overlay') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`absolute inset-0 bg-gray-800/90 backdrop-blur-sm rounded-lg flex items-center justify-center z-20 ${className}`}
      >
        {loadingContent}
      </motion.div>
    )
  }

  // Inline variant
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      {loadingContent}
    </div>
  )
}

// Skeleton loading components for content placeholders
export function PixelSkeleton({ 
  width = '100%', 
  height = '1rem', 
  className = '' 
}: { 
  width?: string | number
  height?: string | number
  className?: string 
}) {
  return (
    <motion.div
      className={`bg-gray-700/30 border border-green-400/10 rounded-none ${className}`}
      style={{ width, height }}
      animate={{
        opacity: [0.3, 0.7, 0.3]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Pixel texture overlay */}
      <div 
        className="w-full h-full opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(74, 222, 128, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(74, 222, 128, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '4px 4px'
        }}
      />
    </motion.div>
  )
}

// Blog post card skeleton
export function BlogCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-800 border border-green-400/20 rounded-lg p-6 ${className}`}>
      <div className="space-y-4">
        {/* Title skeleton */}
        <PixelSkeleton height="1.5rem" width="80%" />
        
        {/* Meta info skeleton */}
        <div className="flex space-x-4">
          <PixelSkeleton height="0.875rem" width="4rem" />
          <PixelSkeleton height="0.875rem" width="6rem" />
        </div>
        
        {/* Content skeleton */}
        <div className="space-y-2">
          <PixelSkeleton height="1rem" width="100%" />
          <PixelSkeleton height="1rem" width="90%" />
          <PixelSkeleton height="1rem" width="75%" />
        </div>
        
        {/* Button skeleton */}
        <PixelSkeleton height="2.5rem" width="8rem" />
      </div>
    </div>
  )
}

// Content grid skeleton
export function ContentGridSkeleton({ 
  count = 6, 
  className = '' 
}: { 
  count?: number
  className?: string 
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <BlogCardSkeleton />
        </motion.div>
      ))}
    </div>
  )
}