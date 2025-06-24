'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Zap, CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react'

interface LoadingStage {
  id: string
  label: string
  description?: string
  duration?: number
  progress?: number
}

interface ProgressiveLoadingProps {
  variant?: 'full' | 'overlay' | 'inline' | 'skeleton'
  stages?: LoadingStage[]
  currentStage?: string
  progress?: number
  message?: string
  contextualMessages?: boolean
  showNetworkStatus?: boolean
  enableProgressiveLoading?: boolean
  className?: string
}

export function ProgressiveLoadingSystem({
  variant = 'inline',
  stages = [],
  currentStage,
  progress = 0,
  message = 'Loading content...',
  contextualMessages = true,
  showNetworkStatus = true,
  enableProgressiveLoading = true,
  className = ''
}: ProgressiveLoadingProps) {
  const [currentProgress, setCurrentProgress] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const [loadingStartTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState(0)
  const progressRef = useRef<HTMLDivElement>(null)

  // Default loading stages for blog content
  const defaultStages: LoadingStage[] = [
    { id: 'fetch', label: 'Fetching content', description: 'Retrieving data from server', duration: 800 },
    { id: 'parse', label: 'Processing data', description: 'Parsing markdown and metadata', duration: 400 },
    { id: 'render', label: 'Preparing display', description: 'Optimizing for your device', duration: 600 },
    { id: 'complete', label: 'Ready to view', description: 'Content loaded successfully', duration: 200 }
  ]

  const loadingStages = stages.length > 0 ? stages : defaultStages

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Elapsed time tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Date.now() - loadingStartTime)
    }, 100)
    
    return () => clearInterval(interval)
  }, [loadingStartTime])

  // Progressive progress simulation if no explicit progress provided
  useEffect(() => {
    if (progress > 0) {
      setCurrentProgress(progress)
      return
    }

    if (!enableProgressiveLoading) return

    const progressInterval = setInterval(() => {
      setCurrentProgress(prev => {
        if (prev >= 95) return prev
        const increment = Math.random() * 3 + 1
        return Math.min(prev + increment, 95)
      })
    }, 200)

    return () => clearInterval(progressInterval)
  }, [progress, enableProgressiveLoading])

  // Contextual loading messages based on elapsed time
  const getContextualMessage = () => {
    if (!contextualMessages) return message
    
    const seconds = Math.floor(elapsedTime / 1000)
    
    if (!isOnline) return 'Connection lost. Retrying...'
    if (seconds < 2) return 'Loading content...'
    if (seconds < 5) return 'Processing data...'
    if (seconds < 10) return 'Almost ready...'
    return 'This is taking longer than usual. Please wait...'
  }

  // Get current stage info
  const getCurrentStageInfo = () => {
    if (currentStage) {
      return loadingStages.find(stage => stage.id === currentStage)
    }
    
    // Auto-determine stage based on progress
    const stageIndex = Math.floor((currentProgress / 100) * loadingStages.length)
    return loadingStages[Math.min(stageIndex, loadingStages.length - 1)]
  }

  const currentStageInfo = getCurrentStageInfo()

  // Enhanced skeleton components
  const ContentSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-700/30 rounded w-48"></div>
        <div className="h-6 bg-gray-700/30 rounded w-24"></div>
      </div>
      
      {/* Title skeleton */}
      <div className="space-y-3">
        <div className="h-6 bg-gray-700/30 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700/30 rounded w-1/2"></div>
      </div>
      
      {/* Content blocks */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-700/30 rounded w-full"></div>
            <div className="h-4 bg-gray-700/30 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700/30 rounded w-4/6"></div>
          </div>
        ))}
      </div>
      
      {/* Tags skeleton */}
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-6 bg-gray-700/30 rounded w-16"></div>
        ))}
      </div>
    </div>
  )

  if (variant === 'skeleton') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={className}
      >
        <ContentSkeleton />
      </motion.div>
    )
  }

  const loadingContent = (
    <div className="flex flex-col items-center justify-center space-y-6 p-8">
      {/* Main loading indicator */}
      <div className="relative">
        <motion.div
          className="w-16 h-16 border-4 border-gray-700 border-t-green-400 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner progress ring */}
        <motion.div
          className="absolute inset-2 border-2 border-gray-800 border-r-green-400/50 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Zap className="w-6 h-6 text-green-400" />
        </div>
      </div>

      {/* Progress information */}
      <div className="text-center space-y-4 max-w-md">
        <motion.h3
          className="font-pixel text-lg text-green-400"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {currentStageInfo?.label || 'Loading'}
        </motion.h3>
        
        <p className="text-gray-400 font-mono text-sm">
          {getContextualMessage()}
        </p>
        
        {currentStageInfo?.description && (
          <p className="text-gray-500 text-xs">
            {currentStageInfo.description}
          </p>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md space-y-2">
        <div className="flex justify-between text-xs text-gray-500 font-mono">
          <span>{Math.round(currentProgress)}%</span>
          <span>{(elapsedTime / 1000).toFixed(1)}s</span>
        </div>
        
        <div 
          ref={progressRef}
          className="w-full h-2 bg-gray-800 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-green-500 relative"
            initial={{ width: 0 }}
            animate={{ width: `${currentProgress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>

      {/* Stage indicators */}
      {loadingStages.length > 0 && (
        <div className="flex items-center space-x-4">
          {loadingStages.map((stage, index) => {
            const isActive = stage.id === currentStageInfo?.id
            const isCompleted = loadingStages.indexOf(currentStageInfo || loadingStages[0]) > index
            
            return (
              <motion.div
                key={stage.id}
                className="flex flex-col items-center space-y-1"
                initial={{ opacity: 0.3, scale: 0.8 }}
                animate={{ 
                  opacity: isActive ? 1 : isCompleted ? 0.8 : 0.3,
                  scale: isActive ? 1.1 : 1 
                }}
                transition={{ duration: 0.3 }}
              >
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  isCompleted ? 'bg-green-400 border-green-400 text-black' :
                  isActive ? 'border-green-400 text-green-400' :
                  'border-gray-600 text-gray-600'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>
                <span className="text-xs text-gray-500 font-mono">{stage.label}</span>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Network status */}
      {showNetworkStatus && (
        <motion.div
          className="flex items-center space-x-2 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          {isOnline ? (
            <>
              <Wifi className="w-4 h-4 text-green-400" />
              <span className="text-gray-400 font-mono">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-mono">Offline</span>
            </>
          )}
        </motion.div>
      )}

      {/* Performance hint */}
      {elapsedTime > 3000 && (
        <motion.div
          className="text-xs text-gray-500 font-mono text-center max-w-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="w-4 h-4 inline mr-1" />
          Slow connection detected. Content is still loading...
        </motion.div>
      )}
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`py-12 ${className}`}
    >
      {loadingContent}
    </motion.div>
  )
}

// Grid of loading cards
export function LoadingCardGrid({ 
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
          className="border border-gray-700/30 rounded-lg p-6 space-y-4"
        >
          <div className="animate-pulse space-y-4">
            <div className="flex justify-between items-start">
              <div className="h-6 bg-gray-700/30 rounded w-20"></div>
              <div className="h-4 bg-gray-700/30 rounded w-16"></div>
            </div>
            <div className="h-6 bg-gray-700/30 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700/30 rounded w-full"></div>
              <div className="h-4 bg-gray-700/30 rounded w-5/6"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-5 bg-gray-700/30 rounded w-12"></div>
              <div className="h-5 bg-gray-700/30 rounded w-16"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default ProgressiveLoadingSystem