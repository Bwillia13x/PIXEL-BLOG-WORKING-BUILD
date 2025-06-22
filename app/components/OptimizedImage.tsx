'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  fill?: boolean
  sizes?: string
  style?: React.CSSProperties
  onClick?: () => void
  loading?: 'lazy' | 'eager'
  // Custom props
  pixelArt?: boolean
  glow?: boolean
  rounded?: boolean
  shadow?: boolean
  hover3d?: boolean
  fadeIn?: boolean
  aspectRatio?: string
  // Enhanced optimization props
  compression?: 'low' | 'medium' | 'high' | 'ultra'
  responsive?: boolean
  preload?: boolean
  webpFallback?: boolean
  criticalResource?: boolean
}

interface PlaceholderProps {
  width?: number
  height?: number
  className?: string
  aspectRatio?: string
}

interface ImageErrorProps extends PlaceholderProps {
  error: string
}

// Enhanced blur data URL generator with better quality
const generateBlurDataURL = (w: number, h: number, color = '#1f2937'): string => {
  const svg = `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="50%" style="stop-color:#374151;stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:1" />
        </linearGradient>
        <pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="25" cy="25" r="1" fill="#4b5563" opacity="0.3"/>
          <circle cx="75" cy="75" r="1" fill="#4b5563" opacity="0.3"/>
          <circle cx="50" cy="75" r="0.5" fill="#6b7280" opacity="0.5"/>
          <circle cx="25" cy="50" r="0.5" fill="#6b7280" opacity="0.4"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <rect width="100%" height="100%" fill="url(#grain)"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

// Optimized quality settings based on compression level
const getOptimizedQuality = (compression: string = 'medium', isLowBandwidth = false): number => {
  const baseQuality = {
    low: 95,
    medium: 85,
    high: 75,
    ultra: 65
  }[compression] || 85

  // Reduce quality further for slow connections
  return isLowBandwidth ? Math.max(baseQuality - 15, 50) : baseQuality
}

// Generate responsive sizes string based on usage context
const generateResponsiveSizes = (responsive: boolean, width?: number): string => {
  if (!responsive) {
    return width ? `${width}px` : '100vw'
  }

  // Smart responsive sizes for different contexts
  return `
    (max-width: 640px) 100vw,
    (max-width: 768px) 50vw,
    (max-width: 1024px) 33vw,
    25vw
  `.replace(/\s+/g, ' ').trim()
}

function ImagePlaceholder({ width, height, className, aspectRatio }: PlaceholderProps) {
  const style: React.CSSProperties = {}
  
  if (aspectRatio) {
    style.aspectRatio = aspectRatio
  } else if (width && height) {
    style.width = width
    style.height = height
  }

  return (
    <motion.div 
      className={`
        relative animate-pulse bg-gradient-to-br from-gray-800 to-gray-900 
        border border-gray-700 flex items-center justify-center overflow-hidden ${className}
      `}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated loading pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent animate-pulse"
           style={{ animation: 'shimmer 2s infinite' }} />
      
      {/* Icon placeholder */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10"
      >
        <svg
          className="w-8 h-8 text-gray-600"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      </motion.div>

      {/* Pixel grid overlay for theme consistency */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
           style={{
             backgroundImage: `
               repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(74, 222, 128, 0.1) 4px, rgba(74, 222, 128, 0.1) 5px),
               repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(74, 222, 128, 0.1) 4px, rgba(74, 222, 128, 0.1) 5px)
             `
           }} />
    </motion.div>
  )
}

function ImageError({ width, height, className, aspectRatio, error }: ImageErrorProps) {
  const style: React.CSSProperties = {}
  
  if (aspectRatio) {
    style.aspectRatio = aspectRatio
  } else if (width && height) {
    style.width = width
    style.height = height
  }

  return (
    <motion.div 
      className={`
        relative bg-gradient-to-br from-red-900/20 to-gray-900 
        border border-red-700/50 flex flex-col items-center justify-center 
        text-red-400 text-sm p-4 rounded ${className}
      `}
      style={style}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center space-y-2">
        <svg className="w-6 h-6 mx-auto text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div className="font-mono text-xs">{error}</div>
      </div>
    </motion.div>
  )
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality,
  placeholder = 'blur',
  blurDataURL,
  fill = false,
  sizes,
  style,
  onClick,
  loading = 'lazy',
  // Custom props
  pixelArt = false,
  glow = false,
  rounded = false,
  shadow = false,
  hover3d = false,
  fadeIn = true,
  aspectRatio,
  // Enhanced optimization props
  compression = 'medium',
  responsive = true,
  preload = false,
  webpFallback = true,
  criticalResource = false,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [connectionSpeed, setConnectionSpeed] = useState<'slow' | 'fast'>('fast')
  const imgRef = useRef<HTMLImageElement>(null)

  // Detect connection speed
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection
      if (connection) {
        const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                               connection.effectiveType === '2g' || 
                               connection.downlink < 1.5
        setConnectionSpeed(isSlowConnection ? 'slow' : 'fast')
      }
    }
  }, [])

  // Enhanced quality calculation
  const optimizedQuality = quality || getOptimizedQuality(compression, connectionSpeed === 'slow')

  // Generate responsive sizes
  const responsiveSizes = sizes || generateResponsiveSizes(responsive, width)

  // Generate optimized classes
  const imageClasses = [
    className,
    pixelArt && 'pixelated',
    glow && 'drop-shadow-lg',
    rounded && 'rounded-lg',
    shadow && 'shadow-xl',
    'transition-all duration-300',
    hover3d && 'hover:scale-105 hover:rotate-1',
    onClick && 'cursor-pointer',
    'gpu-optimized' // Add GPU optimization class
  ].filter(Boolean).join(' ')

  // Enhanced blur data URL
  const optimizedBlurDataURL = blurDataURL || 
    (placeholder === 'blur' && width && height ? generateBlurDataURL(width, height) : undefined)

  // Preload critical images
  useEffect(() => {
    if ((priority || preload || criticalResource) && typeof window !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      if (webpFallback && !src.includes('.webp')) {
        link.type = 'image/webp'
      }
      document.head.appendChild(link)

      return () => {
        if (link.parentNode) {
          link.parentNode.removeChild(link)
        }
      }
    }
  }, [src, priority, preload, criticalResource, webpFallback])

  const handleLoad = () => {
    setIsLoading(false)
    setError(null)
  }

  const handleError = () => {
    setIsLoading(false)
    setError('Failed to load image')
  }

  // Create optimized image component with enhanced Next.js Image features
  const imageComponent = (
    <Image
      ref={imgRef}
      src={src}
      alt={alt}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      fill={fill}
      className={imageClasses}
      priority={priority || criticalResource}
      quality={optimizedQuality}
      placeholder={placeholder}
      blurDataURL={optimizedBlurDataURL}
      sizes={responsiveSizes}
      style={{
        ...style,
        ...(aspectRatio && { aspectRatio }),
        ...(pixelArt && { 
          imageRendering: 'pixelated' as any,
          imageRendering: '-moz-crisp-edges' as any,
          imageRendering: 'crisp-edges' as any
        })
      }}
      onLoad={handleLoad}
      onError={handleError}
      loading={priority || criticalResource ? 'eager' : loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      unoptimized={pixelArt} // Disable optimization for pixel art to preserve crisp edges
      {...props}
    />
  )

  // Enhanced motion wrapper with better performance
  const MotionWrapper = ({ children }: { children: React.ReactNode }) => {
    if (!fadeIn && !hover3d) return <>{children}</>

    return (
      <motion.div
        initial={fadeIn ? { opacity: 0, y: 20 } : undefined}
        animate={fadeIn ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        whileHover={hover3d ? { 
          scale: 1.05, 
          rotateY: 5,
          transition: { duration: 0.2, ease: 'easeOut' }
        } : undefined}
        style={{ 
          transformStyle: 'preserve-3d',
          willChange: hover3d ? 'transform' : 'auto',
          ...(glow && isHovered && {
            filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.5))'
          })
        }}
        className="gpu-optimized"
      >
        {children}
      </motion.div>
    )
  }

  if (error) {
    return (
      <ImageError 
        width={width} 
        height={height} 
        className={className}
        aspectRatio={aspectRatio}
        error={error}
      />
    )
  }

  if (isLoading && placeholder === 'empty') {
    return (
      <ImagePlaceholder 
        width={width} 
        height={height} 
        className={className}
        aspectRatio={aspectRatio}
      />
    )
  }

  return (
    <MotionWrapper>
      <div className="relative overflow-hidden gpu-optimized">
        {imageComponent}
        
        {/* Enhanced pixel art overlay effect */}
        {pixelArt && (
          <motion.div 
            className="absolute inset-0 pointer-events-none opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.3 : 0.2 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 1px,
                  rgba(34, 197, 94, 0.1) 1px,
                  rgba(34, 197, 94, 0.1) 2px
                ),
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 1px,
                  rgba(34, 197, 94, 0.1) 1px,
                  rgba(34, 197, 94, 0.1) 2px
                )
              `
            }}
          />
        )}

        {/* Enhanced glow effect overlay */}
        {glow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(34, 197, 94, 0.2) 0%, transparent 70%)',
              mixBlendMode: 'screen'
            }}
          />
        )}

        {/* Loading overlay for better UX */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute inset-0 bg-gray-800/50 flex items-center justify-center"
          >
            <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </div>
    </MotionWrapper>
  )
}

// Enhanced specialized image components

interface HeroImageProps extends OptimizedImageProps {
  overlay?: boolean
  overlayOpacity?: number
}

export function HeroImage({ 
  overlay = false, 
  overlayOpacity = 0.5, 
  className = '',
  children,
  priority = true,
  compression = 'high',
  quality = 90,
  criticalResource = true,
  ...props 
}: HeroImageProps & { children?: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <OptimizedImage
        {...props}
        className={`w-full h-full object-cover ${className}`}
        priority={priority}
        compression={compression}
        quality={quality}
        criticalResource={criticalResource}
        responsive={true}
        sizes="100vw"
        placeholder="blur"
      />
      {overlay && (
        <motion.div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: overlayOpacity }}
          transition={{ duration: 0.5 }}
        />
      )}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {children}
        </div>
      )}
    </div>
  )
}

interface ThumbnailImageProps extends OptimizedImageProps {
  badge?: string
  badgeColor?: string
}

export function ThumbnailImage({ 
  badge, 
  badgeColor = 'bg-green-500', 
  className = '',
  compression = 'medium',
  quality = 85,
  responsive = true,
  hover3d = true,
  ...props 
}: ThumbnailImageProps) {
  return (
    <div className="relative group">
      <OptimizedImage
        {...props}
        className={`rounded-lg transition-all duration-300 group-hover:scale-105 ${className}`}
        compression={compression}
        quality={quality}
        responsive={responsive}
        hover3d={hover3d}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholder="blur"
      />
      {badge && (
        <motion.div 
          className={`
            absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-mono text-white
            ${badgeColor} backdrop-blur-sm
          `}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {badge}
        </motion.div>
      )}
    </div>
  )
}

// Card image specifically optimized for blog post cards
interface CardImageProps extends OptimizedImageProps {
  category?: string
}

export function CardImage({ 
  category,
  className = '',
  compression = 'medium',
  quality = 80,
  responsive = true,
  ...props 
}: CardImageProps) {
  return (
    <div className="relative overflow-hidden group">
      <OptimizedImage
        {...props}
        className={`w-full h-48 object-cover transition-all duration-500 group-hover:scale-110 ${className}`}
        compression={compression}
        quality={quality}
        responsive={responsive}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        placeholder="blur"
        fadeIn={true}
      />
      {category && (
        <motion.div 
          className="absolute top-3 left-3 px-2 py-1 bg-black/70 backdrop-blur-sm text-green-400 text-xs font-pixel rounded border border-green-400/30"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {category}
        </motion.div>
      )}
      
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
    </div>
  )
}