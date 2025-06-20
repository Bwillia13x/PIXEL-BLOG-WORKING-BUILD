'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon, 
  ArrowTopRightOnSquareIcon, 
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline'
import { Project, CurrentProject } from '@/content/projects'

interface DemoOverlayProps {
  project: Project | CurrentProject | null
  isOpen: boolean
  onClose: () => void
  className?: string
}

interface DemoControlsProps {
  project: Project | CurrentProject
  isFullscreen: boolean
  onToggleFullscreen: () => void
  onOpenExternal: () => void
  onClose: () => void
  isLoading: boolean
}

function DemoControls({
  project,
  isFullscreen,
  onToggleFullscreen,
  onOpenExternal,
  onClose,
  isLoading
}: DemoControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between p-4 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700"
    >
      {/* Project Info */}
      <div className="flex items-center space-x-4">
        <div>
          <h3 className="font-mono text-lg font-bold text-white">
            {project.title}
          </h3>
          <p className="text-sm text-gray-400 font-mono">
            Live Demo
          </p>
        </div>
        
        {isLoading && (
          <div className="flex items-center space-x-2 text-yellow-400">
            <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono">Loading...</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleFullscreen}
          className="
            flex items-center space-x-1 px-3 py-2 pixel-border 
            bg-blue-500/20 text-blue-400 border-blue-500/50 
            hover:bg-blue-500/30 transition-all duration-200 font-mono text-sm
          "
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            <ArrowsPointingInIcon className="h-4 w-4" />
          ) : (
            <ArrowsPointingOutIcon className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </span>
        </button>

        <button
          onClick={onOpenExternal}
          className="
            flex items-center space-x-1 px-3 py-2 pixel-border 
            bg-green-500/20 text-green-400 border-green-500/50 
            hover:bg-green-500/30 transition-all duration-200 font-mono text-sm
          "
          title="Open in new tab"
        >
          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          <span className="hidden sm:inline">External</span>
        </button>

        <button
          onClick={onClose}
          className="
            flex items-center space-x-1 px-3 py-2 pixel-border 
            bg-red-500/20 text-red-400 border-red-500/50 
            hover:bg-red-500/30 transition-all duration-200 font-mono text-sm
          "
          title="Close demo"
        >
          <XMarkIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Close</span>
        </button>
      </div>
    </motion.div>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-full bg-gray-900">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="space-y-2">
          <h3 className="font-mono text-lg text-white">Loading Demo</h3>
          <p className="font-mono text-sm text-gray-400">
            Initializing interactive experience...
          </p>
        </div>
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ErrorState({ 
  project, 
  onRetry, 
  onOpenExternal 
}: { 
  project: Project | CurrentProject
  onRetry: () => void
  onOpenExternal: () => void
}) {
  return (
    <div className="flex items-center justify-center h-full bg-gray-900">
      <div className="text-center space-y-6 max-w-md px-6">
        <div className="pixel-border bg-red-500/20 border-red-500/50 p-6">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="font-mono text-lg text-white mb-2">
            Demo Unavailable
          </h3>
          <p className="font-mono text-sm text-gray-400 mb-6">
            The demo couldn't be loaded. This might be due to network issues 
            or the demo server being temporarily unavailable.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={onRetry}
              className="
                w-full px-4 py-2 pixel-border bg-blue-500/20 text-blue-400 
                border-blue-500/50 hover:bg-blue-500/30 transition-all duration-200 
                font-mono text-sm
              "
            >
              Try Again
            </button>
            
            {project.demo && (
              <button
                onClick={onOpenExternal}
                className="
                  w-full px-4 py-2 pixel-border bg-green-500/20 text-green-400 
                  border-green-500/50 hover:bg-green-500/30 transition-all duration-200 
                  font-mono text-sm
                "
              >
                Open in New Tab
              </button>
            )}
          </div>
        </div>
        
        <div className="text-xs text-gray-500 font-mono">
          <p>• Check your internet connection</p>
          <p>• Try refreshing the page</p>
          <p>• Some demos require modern browsers</p>
        </div>
      </div>
    </div>
  )
}

export default function DemoOverlay({
  project,
  isOpen,
  onClose,
  className = ""
}: DemoOverlayProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [retryKey, setRetryKey] = useState(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Reset states when project changes
  useEffect(() => {
    if (project) {
      setIsLoading(true)
      setHasError(false)
      setIsFullscreen(false)
      setRetryKey(prev => prev + 1)
    }
  }, [project?.id])

  // Handle iframe load events
  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  // Fullscreen functionality
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      overlayRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Open external demo
  const openExternal = () => {
    if (project?.demo) {
      window.open(project.demo, '_blank', 'noopener,noreferrer')
    }
  }

  // Retry loading
  const retryDemo = () => {
    setIsLoading(true)
    setHasError(false)
    setRetryKey(prev => prev + 1)
  }

  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Demo Container */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
            className={`
              fixed inset-4 md:inset-8 lg:inset-16 z-50 flex flex-col
              pixel-border bg-gray-900 overflow-hidden
              ${isFullscreen ? '!inset-0' : ''}
              ${className}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Controls Header */}
            <DemoControls
              project={project}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              onOpenExternal={openExternal}
              onClose={onClose}
              isLoading={isLoading}
            />

            {/* Demo Content */}
            <div className="flex-1 relative overflow-hidden">
              {isLoading && <LoadingState />}
              
              {hasError ? (
                <ErrorState
                  project={project}
                  onRetry={retryDemo}
                  onOpenExternal={openExternal}
                />
              ) : (
                project.demo && (
                  <iframe
                    key={retryKey}
                    ref={iframeRef}
                    src={project.demo}
                    className="w-full h-full border-0"
                    title={`${project.title} Demo`}
                    allowFullScreen
                    sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-modals allow-orientation-lock allow-pointer-lock allow-presentation"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    style={{ 
                      display: isLoading ? 'none' : 'block'
                    }}
                  />
                )
              )}

              {/* Demo Info Overlay */}
              <AnimatePresence>
                {!isLoading && !hasError && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute bottom-4 left-4 right-4 pointer-events-none"
                  >
                    <div className="pixel-border bg-gray-900/90 backdrop-blur-sm p-3 max-w-md">
                      <div className="flex items-center space-x-2">
                        <PlayIcon className="h-4 w-4 text-green-400 animate-pulse" />
                        <div className="text-xs font-mono text-gray-300">
                          <div className="text-white font-semibold mb-1">
                            {project.title} - Live Demo
                          </div>
                          <div>
                            Interact with the demo above. Use controls to navigate and explore features.
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Loading Progress Bar */}
            {isLoading && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 to-cyan-400"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}