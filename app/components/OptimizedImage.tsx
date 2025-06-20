'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
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
}

interface PlaceholderProps {
  width?: number
  height?: number
  className?: string
  aspectRatio?: string
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
    <div 
      className={`
        animate-pulse bg-gray-800 border-2 border-gray-600 
        flex items-center justify-center ${className}
      `}
      style={style}
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
    </div>
  )
}

interface ErrorImageProps extends PlaceholderProps {
  error?: string
}

function ImageError({ width, height, className, aspectRatio, error }: ErrorImageProps) {
  const style: React.CSSProperties = {}
  
  if (aspectRatio) {
    style.aspectRatio = aspectRatio
  } else if (width && height) {
    style.width = width
    style.height = height
  }

  return (
    <div 
      className={`
        bg-red-900/20 border-2 border-red-500/50 
        flex flex-col items-center justify-center p-4 ${className}
      `}
      style={style}
      title={error || 'Failed to load image'}
    >
      <svg
        className="w-8 h-8 text-red-400 mb-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <span className="text-xs text-red-400 font-mono text-center">
        {error || 'Failed to load'}
      </span>
    </div>
  )
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 90,
  placeholder = 'empty',
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
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Generate optimized image classes
  const imageClasses = [
    className,
    pixelArt && 'pixelated',
    glow && 'drop-shadow-lg',
    rounded && 'rounded-lg',
    shadow && 'shadow-xl',
    'transition-all duration-300',
    hover3d && 'hover:scale-105 hover:rotate-1',
    onClick && 'cursor-pointer'
  ].filter(Boolean).join(' ')

  // Generate blur data URL if not provided
  const generateBlurDataURL = (w: number, h: number): string => {
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1f2937"/>
        <rect width="100%" height="100%" fill="url(#grain)"/>
        <defs>
          <pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="1" fill="#374151" opacity="0.5"/>
            <circle cx="75" cy="75" r="1" fill="#374151" opacity="0.5"/>
          </pattern>
        </defs>
      </svg>`
    ).toString('base64')}`
  }

  const handleLoad = () => {
    setIsLoading(false)
    setError(null)
  }

  const handleError = () => {
    setIsLoading(false)
    setError('Failed to load image')
  }

  // Create optimized image component
  const imageComponent = (
    <Image
      src={src}
      alt={alt}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      fill={fill}
      className={imageClasses}
      priority={priority}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={
        placeholder === 'blur' 
          ? blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined)
          : undefined
      }
      sizes={sizes}
      style={{
        ...style,
        ...(aspectRatio && { aspectRatio }),
        ...(pixelArt && { 
          imageRendering: 'pixelated',
          imageRendering: '-moz-crisp-edges' as any,
          imageRendering: 'crisp-edges'
        })
      }}
      onLoad={handleLoad}
      onError={handleError}
      loading={loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      {...props}
    />
  )

  // Wrap with motion if animations are enabled
  const MotionWrapper = ({ children }: { children: React.ReactNode }) => {
    if (!fadeIn && !hover3d) return <>{children}</>

    return (
      <motion.div
        initial={fadeIn ? { opacity: 0, y: 20 } : undefined}
        animate={fadeIn ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5 }}
        whileHover={hover3d ? { 
          scale: 1.05, 
          rotateY: 5,
          transition: { duration: 0.2 }
        } : undefined}
        style={{ 
          transformStyle: 'preserve-3d',
          ...(glow && isHovered && {
            filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.5))'
          })
        }}
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
      <div className="relative overflow-hidden">
        {imageComponent}
        
        {/* Pixel art overlay effect */}
        {pixelArt && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
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

        {/* Glow effect overlay */}
        {glow && isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(34, 197, 94, 0.2) 0%, transparent 70%)',
              mixBlendMode: 'screen'
            }}
          />
        )}
      </div>
    </MotionWrapper>
  )
}

// Specialized components for common use cases

interface AvatarImageProps extends Omit<OptimizedImageProps, 'rounded'> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  online?: boolean
}

export function AvatarImage({ 
  size = 'md', 
  online, 
  className = '',
  ...props 
}: AvatarImageProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  return (
    <div className="relative inline-block">
      <OptimizedImage
        {...props}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
        rounded={true}
      />
      {online && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900" />
      )}
    </div>
  )
}

interface HeroImageProps extends OptimizedImageProps {
  overlay?: boolean
  overlayOpacity?: number
}

export function HeroImage({ 
  overlay = false, 
  overlayOpacity = 0.5, 
  className = '',
  children,
  ...props 
}: HeroImageProps & { children?: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <OptimizedImage
        {...props}
        className={`w-full object-cover ${className}`}
        priority={true}
      />
      {overlay && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
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
  ...props 
}: ThumbnailImageProps) {
  return (
    <div className="relative group">
      <OptimizedImage
        {...props}
        className={`rounded-lg transition-all duration-300 group-hover:scale-105 ${className}`}
        hover3d={true}
      />
      {badge && (
        <div className={`
          absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-mono text-white
          ${badgeColor}
        `}>
          {badge}
        </div>
      )}
    </div>
  )
}