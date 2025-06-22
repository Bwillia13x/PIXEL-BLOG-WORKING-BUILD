'use client'

import { lazy, Suspense, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LazyLoadProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  className?: string
  fadeIn?: boolean
  slideIn?: 'up' | 'down' | 'left' | 'right' | false
  delay?: number
  minHeight?: string | number
}

interface LoadingSkeletonProps {
  lines?: number
  height?: string
  className?: string
  animate?: boolean
}

function LoadingSkeleton({ 
  lines = 3, 
  height = '1rem', 
  className = '',
  animate = true 
}: LoadingSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`
            bg-gray-800 rounded pixel-border
            ${animate ? 'animate-pulse' : ''}
          `}
          style={{ 
            height,
            width: index === lines - 1 ? '75%' : '100%'
          }}
        />
      ))}
    </div>
  )
}

interface PixelLoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function PixelLoading({ size = 'md', className = '' }: PixelLoadingProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`
          ${sizeClasses[size]} bg-green-400 pixel-border
          relative overflow-hidden
        `}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </motion.div>
    </div>
  )
}

interface ContentSkeletonProps {
  type: 'article' | 'card' | 'list' | 'hero' | 'sidebar'
  className?: string
}

function ContentSkeleton({ type, className = '' }: ContentSkeletonProps) {
  switch (type) {
    case 'article':
      return (
        <div className={`space-y-6 ${className}`}>
          {/* Title */}
          <div className="h-8 bg-gray-800 rounded pixel-border animate-pulse" />
          
          {/* Meta */}
          <div className="flex space-x-4">
            <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
          </div>
          
          {/* Content */}
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-800 rounded animate-pulse"
                style={{ width: i % 3 === 2 ? '85%' : '100%' }}
              />
            ))}
          </div>
        </div>
      )
    
    case 'card':
      return (
        <div className={`pixel-border bg-gray-900/60 p-4 space-y-4 ${className}`}>
          {/* Image */}
          <div className="h-32 bg-gray-800 rounded pixel-border animate-pulse" />
          
          {/* Title */}
          <div className="h-6 bg-gray-800 rounded animate-pulse" />
          
          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse" />
          </div>
          
          {/* Tags */}
          <div className="flex space-x-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-6 w-16 bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        </div>
      )
    
    case 'list':
      return (
        <div className={`space-y-3 ${className}`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 pixel-border bg-gray-900/60">
              <div className="h-10 w-10 bg-gray-800 rounded pixel-border animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-800 rounded animate-pulse" />
                <div className="h-3 w-2/3 bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )
    
    case 'hero':
      return (
        <div className={`space-y-6 ${className}`}>
          {/* Hero image */}
          <div className="h-64 bg-gray-800 rounded-lg pixel-border animate-pulse" />
          
          {/* Hero content */}
          <div className="text-center space-y-4">
            <div className="h-12 bg-gray-800 rounded pixel-border animate-pulse mx-auto max-w-md" />
            <div className="space-y-2 max-w-lg mx-auto">
              <div className="h-4 bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-gray-700 rounded animate-pulse mx-auto" />
            </div>
            <div className="flex justify-center space-x-4">
              <div className="h-10 w-24 bg-gray-700 rounded pixel-border animate-pulse" />
              <div className="h-10 w-24 bg-gray-700 rounded pixel-border animate-pulse" />
            </div>
          </div>
        </div>
      )
    
    case 'sidebar':
      return (
        <div className={`space-y-6 ${className}`}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="pixel-border bg-gray-900/60 p-4 space-y-3">
              <div className="h-5 bg-gray-800 rounded animate-pulse" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-3 bg-gray-700 rounded animate-pulse" style={{ width: `${85 - j * 10}%` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    
    default:
      return <LoadingSkeleton />
  }
}

export function LazySection({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true,
  className = '',
  fadeIn = true,
  slideIn = false,
  delay = 0,
  minHeight
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          setTimeout(() => {
            setIsVisible(true)
            setHasTriggered(true)
          }, delay)
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold, rootMargin, triggerOnce, hasTriggered, delay])

  const getAnimationProps = () => {
    if (!fadeIn && !slideIn) return {}

    const initial: any = {}
    const animate: any = {}

    if (fadeIn) {
      initial.opacity = 0
      animate.opacity = 1
    }

    if (slideIn) {
      switch (slideIn) {
        case 'up':
          initial.y = 50
          animate.y = 0
          break
        case 'down':
          initial.y = -50
          animate.y = 0
          break
        case 'left':
          initial.x = 50
          animate.x = 0
          break
        case 'right':
          initial.x = -50
          animate.x = 0
          break
      }
    }

    return {
      initial,
      animate,
      transition: { duration: 0.6 }
    }
  }

  return (
    <div 
      ref={ref} 
      className={className}
      style={minHeight ? { minHeight } : undefined}
    >
      <AnimatePresence>
        {isVisible ? (
          <motion.div
            key="content"
            {...getAnimationProps()}
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {fallback || <LoadingSkeleton />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Hook for lazy loading components
export function useLazyComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): T | null {
  const [component, setComponent] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!component && !loading) {
      setLoading(true)
      importFunc()
        .then((module) => {
          setComponent(() => module.default)
        })
        .catch(console.error)
        .finally(() => {
          setLoading(false)
        })
    }
  }, [component, loading, importFunc])

  return component
}

// Lazy wrapper for heavy components
interface LazyComponentProps {
  component: () => Promise<{ default: React.ComponentType<any> }>
  fallback?: React.ReactNode
  props?: any
  threshold?: number
  rootMargin?: string
}

export function LazyComponent({
  component,
  fallback = <PixelLoading />,
  props = {},
  threshold = 0.1,
  rootMargin = '50px'
}: LazyComponentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const LazyLoadedComponent = lazy(component)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return (
    <div ref={ref}>
      {isVisible ? (
        <Suspense fallback={fallback}>
          <LazyLoadedComponent {...props} />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  )
}

// Specialized lazy sections for common use cases
interface LazyArticleProps extends Omit<LazyLoadProps, 'fallback'> {
  children: React.ReactNode
}

export function LazyArticle({ children, ...props }: LazyArticleProps) {
  return (
    <LazySection
      fallback={<ContentSkeleton type="article" />}
      slideIn="up"
      {...props}
    >
      {children}
    </LazySection>
  )
}

interface LazyCardGridProps extends Omit<LazyLoadProps, 'fallback'> {
  children: React.ReactNode
  cardCount?: number
}

export function LazyCardGrid({ children, cardCount = 6, ...props }: LazyCardGridProps) {
  const skeletonCards = Array.from({ length: cardCount }).map((_, i) => (
    <ContentSkeleton key={i} type="card" />
  ))

  return (
    <LazySection
      fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skeletonCards}
        </div>
      }
      slideIn="up"
      {...props}
    >
      {children}
    </LazySection>
  )
}

interface LazyHeroProps extends Omit<LazyLoadProps, 'fallback'> {
  children: React.ReactNode
}

export function LazyHero({ children, ...props }: LazyHeroProps) {
  return (
    <LazySection
      fallback={<ContentSkeleton type="hero" />}
      fadeIn={true}
      triggerOnce={true}
      {...props}
    >
      {children}
    </LazySection>
  )
}

export { LoadingSkeleton, PixelLoading, ContentSkeleton }