'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useTheme } from '../Providers'

interface DemoConfiguration {
  id: string
  title: string
  url: string
  type: 'website' | 'codepen' | 'codesandbox' | 'github-pages' | 'vercel' | 'netlify' | 'custom'
  sandbox: SandboxPermissions
  security: SecuritySettings
  responsive: ResponsiveSettings
  loading: LoadingSettings
  fallback?: FallbackContent
  analytics?: AnalyticsSettings
}

interface SandboxPermissions {
  allowForms: boolean
  allowModals: boolean
  allowPointerLock: boolean
  allowPopups: boolean
  allowPopupsToEscapeSandbox: boolean
  allowPresentation: boolean
  allowSameOrigin: boolean
  allowScripts: boolean
  allowTopNavigation: boolean
  allowTopNavigationByUserActivation: boolean
  allowDownloads: boolean
  allowStorageAccessByUserActivation: boolean
}

interface SecuritySettings {
  csp: string // Content Security Policy
  referrerPolicy: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url'
  maxLoadTime: number // milliseconds
  allowedDomains: string[]
  blockTracking: boolean
  sanitizeContent: boolean
}

interface ResponsiveSettings {
  defaultWidth: number
  defaultHeight: number
  minWidth: number
  maxWidth: number
  aspectRatio?: string
  breakpoints: {
    mobile: number
    tablet: number
    desktop: number
  }
  autoResize: boolean
}

interface LoadingSettings {
  showProgress: boolean
  progressColor: string
  loadingMessage: string
  timeout: number
  retryAttempts: number
  lazyLoad: boolean
  preconnect: boolean
}

interface FallbackContent {
  image?: string
  video?: string
  html?: string
  message: string
  actionButton?: {
    text: string
    url: string
  }
}

interface AnalyticsSettings {
  trackViews: boolean
  trackInteractions: boolean
  trackErrors: boolean
  trackPerformance: boolean
}

interface SecureDemoEmbedProps {
  demo: DemoConfiguration
  onLoad?: () => void
  onError?: (error: string) => void
  onInteraction?: (event: string) => void
  className?: string
  controls?: boolean
  autoPlay?: boolean
}

type LoadingState = 'idle' | 'loading' | 'loaded' | 'error' | 'timeout'

export default function SecureDemoEmbed({
  demo,
  onLoad,
  onError,
  onInteraction,
  className = '',
  controls = true,
  autoPlay = false
}: SecureDemoEmbedProps) {
  const { theme } = useTheme()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [loadingState, setLoadingState] = useState<LoadingState>('idle')
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [currentDevice, setCurrentDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [dimensions, setDimensions] = useState({
    width: demo.responsive.defaultWidth,
    height: demo.responsive.defaultHeight
  })
  const [retryCount, setRetryCount] = useState(0)
  const [interactionCount, setInteractionCount] = useState(0)
  const [errorDetails, setErrorDetails] = useState<string>('')

  // Generate sandbox attributes
  const getSandboxAttributes = (): string => {
    const permissions: string[] = []
    
    if (demo.sandbox.allowForms) permissions.push('allow-forms')
    if (demo.sandbox.allowModals) permissions.push('allow-modals')
    if (demo.sandbox.allowPointerLock) permissions.push('allow-pointer-lock')
    if (demo.sandbox.allowPopups) permissions.push('allow-popups')
    if (demo.sandbox.allowPopupsToEscapeSandbox) permissions.push('allow-popups-to-escape-sandbox')
    if (demo.sandbox.allowPresentation) permissions.push('allow-presentation')
    if (demo.sandbox.allowSameOrigin) permissions.push('allow-same-origin')
    if (demo.sandbox.allowScripts) permissions.push('allow-scripts')
    if (demo.sandbox.allowTopNavigation) permissions.push('allow-top-navigation')
    if (demo.sandbox.allowTopNavigationByUserActivation) permissions.push('allow-top-navigation-by-user-activation')
    if (demo.sandbox.allowDownloads) permissions.push('allow-downloads')
    if (demo.sandbox.allowStorageAccessByUserActivation) permissions.push('allow-storage-access-by-user-activation')
    
    return permissions.join(' ')
  }

  // Validate URL security
  const validateUrl = useCallback((url: string): boolean => {
    try {
      const urlObj = new URL(url)
      
      // Check against allowed domains
      if (demo.security.allowedDomains.length > 0) {
        const isAllowed = demo.security.allowedDomains.some(domain => 
          urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
        )
        if (!isAllowed) return false
      }
      
      // Block common malicious patterns
      const blockedPatterns = [
        /javascript:/i,
        /data:/i,
        /vbscript:/i,
        /file:/i
      ]
      
      return !blockedPatterns.some(pattern => pattern.test(url))
    } catch {
      return false
    }
  }, [demo.security.allowedDomains])

  // Handle iframe loading
  const handleIframeLoad = useCallback(() => {
    setLoadingState('loaded')
    setLoadingProgress(100)
    onLoad?.()
    
    // Track analytics
    if (demo.analytics?.trackViews) {
      // Implementation would send analytics event
      console.log('Demo view tracked:', demo.id)
    }
  }, [demo.id, demo.analytics, onLoad])

  const handleIframeError = useCallback((error: string) => {
    setLoadingState('error')
    setErrorDetails(error)
    onError?.(error)
    
    // Track error analytics
    if (demo.analytics?.trackErrors) {
      console.log('Demo error tracked:', demo.id, error)
    }
  }, [demo.id, demo.analytics, onError])

  // Loading timeout
  useEffect(() => {
    if (loadingState === 'loading') {
      const timeout = setTimeout(() => {
        if (loadingState === 'loading') {
          setLoadingState('timeout')
          handleIframeError('Loading timeout exceeded')
        }
      }, demo.loading.timeout)

      return () => clearTimeout(timeout)
    }
  }, [loadingState, demo.loading.timeout, handleIframeError])

  // Progress simulation during loading
  useEffect(() => {
    if (loadingState === 'loading' && demo.loading.showProgress) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 10
        })
      }, 200)

      return () => clearInterval(interval)
    }
  }, [loadingState, demo.loading.showProgress])

  // Handle device size changes
  const setDeviceSize = (device: 'mobile' | 'tablet' | 'desktop') => {
    setCurrentDevice(device)
    
    let width: number
    let height: number
    
    switch (device) {
      case 'mobile':
        width = demo.responsive.breakpoints.mobile
        height = Math.round(width * 1.8) // 16:9 aspect ratio adjusted for mobile
        break
      case 'tablet':
        width = demo.responsive.breakpoints.tablet
        height = Math.round(width * 0.75) // 4:3 aspect ratio
        break
      case 'desktop':
      default:
        width = demo.responsive.breakpoints.desktop
        height = Math.round(width * 0.6) // 16:10 aspect ratio
        break
    }
    
    setDimensions({ width, height })
  }

  // Handle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }, [isFullscreen])

  // Retry loading
  const retryLoad = () => {
    if (retryCount < demo.loading.retryAttempts) {
      setRetryCount(prev => prev + 1)
      setLoadingState('loading')
      setLoadingProgress(0)
      setErrorDetails('')
      
      // Force iframe reload
      if (iframeRef.current) {
        iframeRef.current.src = demo.url
      }
    }
  }

  // Start loading
  const startLoad = useCallback(() => {
    if (!validateUrl(demo.url)) {
      handleIframeError('Invalid or blocked URL')
      return
    }

    setLoadingState('loading')
    setLoadingProgress(0)
  }, [demo.url, handleIframeError, validateUrl])

  // Handle interaction tracking
  const handleInteraction = (event: string) => {
    setInteractionCount(prev => prev + 1)
    onInteraction?.(event)
    
    if (demo.analytics?.trackInteractions) {
      console.log('Demo interaction tracked:', demo.id, event)
    }
  }

  // Initialize loading if autoPlay is enabled
  useEffect(() => {
    if (autoPlay && loadingState === 'idle') {
      startLoad()
    }
  }, [autoPlay, loadingState, startLoad])

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      {/* Loading Spinner */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-green-400 rounded-full animate-spin"></div>
        {demo.loading.showProgress && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-mono text-green-400">
              {Math.round(loadingProgress)}%
            </span>
          </div>
        )}
      </div>
      
      {/* Loading Message */}
      <div className="text-center">
        <div className="font-mono text-green-400 mb-2">Loading Demo</div>
        <div className="text-sm text-gray-400">{demo.loading.loadingMessage}</div>
      </div>
      
      {/* Progress Bar */}
      {demo.loading.showProgress && (
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300 rounded-full"
            style={{
              width: `${loadingProgress}%`,
              backgroundColor: demo.loading.progressColor
            }}
          />
        </div>
      )}
    </div>
  )

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-4 p-6 text-center">
      <div className="text-4xl">⚠️</div>
      <div className="font-mono text-red-400">Failed to Load Demo</div>
      <div className="text-sm text-gray-400 max-w-md">
        {errorDetails || 'The demo could not be loaded. This might be due to network issues or security restrictions.'}
      </div>
      
      {retryCount < demo.loading.retryAttempts && (
        <button
          onClick={retryLoad}
          className="px-4 py-2 bg-red-600/60 hover:bg-red-500/60 text-white font-mono text-sm rounded transition-colors pixel-border-sm"
        >
          🔄 Retry ({retryCount + 1}/{demo.loading.retryAttempts})
        </button>
      )}
      
      {demo.fallback?.actionButton && (
        <a
          href={demo.fallback.actionButton.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-green-600/60 hover:bg-green-500/60 text-white font-mono text-sm rounded transition-colors pixel-border-sm"
        >
          {demo.fallback.actionButton.text}
        </a>
      )}
    </div>
  )

  const renderFallbackContent = () => {
    if (!demo.fallback) return renderErrorState()

    return (
      <div className="relative h-full">
        {/* Fallback Image/Video */}
        {demo.fallback.image && (
          <img
            src={demo.fallback.image}
            alt={demo.title}
            className="w-full h-full object-cover"
          />
        )}
        
        {demo.fallback.video && (
          <video
            src={demo.fallback.video}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-6">
          <div className="text-4xl mb-4">🖥️</div>
          <div className="font-mono text-green-400 text-lg mb-2">Live Demo Unavailable</div>
          <div className="text-sm text-gray-300 mb-4 max-w-md">
            {demo.fallback.message}
          </div>
          
          {demo.fallback.actionButton && (
            <a
              href={demo.fallback.actionButton.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-600/80 hover:bg-green-500/80 text-white font-mono rounded-lg transition-colors pixel-border"
            >
              {demo.fallback.actionButton.text}
            </a>
          )}
        </div>
      </div>
    )
  }

  const renderControls = () => (
    <div className="flex items-center justify-between p-3 bg-gray-800/60 border-t border-green-400/30">
      {/* Device Size Controls */}
      <div className="flex items-center space-x-2">
        {(['mobile', 'tablet', 'desktop'] as const).map((device) => (
          <button
            key={device}
            onClick={() => setDeviceSize(device)}
            className={`px-3 py-1 text-xs font-mono rounded transition-colors pixel-border-sm ${
              currentDevice === device
                ? 'bg-green-600/60 text-white'
                : 'bg-gray-700/60 text-green-400 hover:bg-gray-600/60'
            }`}
          >
            {device === 'mobile' ? '📱' : device === 'tablet' ? '📟' : '💻'} {device}
          </button>
        ))}
      </div>

      {/* Info */}
      <div className="flex items-center space-x-4 text-xs font-mono text-gray-400">
        <span>{dimensions.width}×{dimensions.height}</span>
        {loadingState === 'loaded' && (
          <>
            <span>•</span>
            <span>Secure Sandbox</span>
            {interactionCount > 0 && (
              <>
                <span>•</span>
                <span>{interactionCount} interactions</span>
              </>
            )}
          </>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleInteraction('refresh')}
          className="p-2 bg-gray-700/60 hover:bg-gray-600/60 text-green-400 rounded transition-colors"
          title="Refresh Demo"
        >
          🔄
        </button>
        
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-gray-700/60 hover:bg-gray-600/60 text-green-400 rounded transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? '🔳' : '⛶'}
        </button>
        
        <a
          href={demo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-green-600/60 hover:bg-green-500/60 text-white rounded transition-colors"
          title="Open in New Tab"
          onClick={() => handleInteraction('external_open')}
        >
          🔗
        </a>
      </div>
    </div>
  )

  return (
    <div
      ref={containerRef}
      className={`pixel-border rounded-lg overflow-hidden bg-gray-900 ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height + (controls ? 60 : 0),
        maxWidth: '100%'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-800/80 border-b border-green-400/30">
        <div className="flex items-center space-x-3">
          <span className="text-lg">🚀</span>
          <div>
            <h3 className="font-mono text-green-400 text-sm font-semibold">{demo.title}</h3>
            <div className="text-xs text-gray-400">{demo.type} • Secure Sandbox</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Security Indicator */}
          <div className="flex items-center space-x-1 px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs font-mono">
            <span>🔒</span>
            <span>Secure</span>
          </div>
          
          {/* Load Button */}
          {loadingState === 'idle' && (
            <button
              onClick={startLoad}
              className="px-3 py-1 bg-green-600/60 hover:bg-green-500/60 text-white font-mono text-xs rounded transition-colors"
            >
              ▶️ Load Demo
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative" style={{ height: dimensions.height }}>
        {loadingState === 'idle' && (
          <div className="flex items-center justify-center h-full">
            <button
              onClick={startLoad}
              className="flex flex-col items-center space-y-3 p-6 hover:bg-gray-800/40 rounded-lg transition-colors"
            >
              <div className="text-4xl">▶️</div>
              <div className="font-mono text-green-400">Load {demo.title}</div>
              <div className="text-xs text-gray-400">Click to start secure demo</div>
            </button>
          </div>
        )}

        {loadingState === 'loading' && renderLoadingState()}

        {(loadingState === 'error' || loadingState === 'timeout') && 
          (demo.fallback ? renderFallbackContent() : renderErrorState())
        }

        {loadingState === 'loaded' && (
          <iframe
            ref={iframeRef}
            src={demo.url}
            title={demo.title}
            width="100%"
            height="100%"
            sandbox={getSandboxAttributes()}
            referrerPolicy={demo.security.referrerPolicy}
            onLoad={handleIframeLoad}
            onError={() => handleIframeError('Failed to load iframe')}
            style={{
              border: 'none',
              backgroundColor: '#111827'
            }}
            allow={demo.security.csp}
          />
        )}
      </div>

      {/* Controls */}
      {controls && renderControls()}
    </div>
  )
}