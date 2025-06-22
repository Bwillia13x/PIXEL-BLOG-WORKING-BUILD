"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-green-400">
          <div className="text-center space-p-lg bg-gray-800 rounded-lg border border-red-500/50 max-w-md">
            <h2 className="text-hierarchy-h2 font-pixel mb-4 text-red-400">System Error</h2>
            <p className="text-hierarchy-body mb-4">
              Something went wrong. The pixel matrix has been disrupted.
            </p>
            {this.state.error && (
              <details className="text-left mb-4">
                <summary className="cursor-pointer text-hierarchy-small text-gray-400 hover:text-green-400">
                  Technical Details
                </summary>
                <pre className="text-xs mt-2 p-2 bg-gray-900 rounded overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-green-600 text-black font-pixel rounded hover:bg-green-500 transition-colors focus-enhanced"
            >
              Reload Application
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Functional error display component for use in server components
export function ErrorDisplay({ 
  title = "Error", 
  message, 
  retryAction 
}: { 
  title?: string
  message: string
  retryAction?: () => void 
}) {
  return (
    <div className="bg-red-900/20 border border-red-500/50 rounded-lg space-p-lg text-center">
      <h3 className="text-hierarchy-h3 font-pixel mb-2 text-red-400">{title}</h3>
      <p className="text-hierarchy-small text-red-300 mb-4">{message}</p>
      {retryAction && (
        <button
          onClick={retryAction}
          className="px-4 py-2 bg-red-600 text-white font-pixel rounded hover:bg-red-500 transition-colors focus-enhanced"
        >
          Retry
        </button>
      )}
    </div>
  )
}

// Client-side error display with retry functionality
export function ClientErrorDisplay({ 
  title = "Unable to Load Content", 
  message 
}: { 
  title?: string
  message: string 
}) {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="relative bg-gray-900/60 border border-yellow-500/40 rounded-lg p-6 text-center backdrop-blur-sm">
      {/* Retro scan lines effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255, 193, 7, 0.1) 2px,
              rgba(255, 193, 7, 0.1) 4px
            )`
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="mb-4">
          <div className="text-4xl font-pixel text-yellow-400 mb-2">⚠</div>
          <h3 className="text-lg font-pixel text-yellow-400 mb-2">{title}</h3>
        </div>
        
        <div className="bg-gray-800/80 border border-yellow-500/20 rounded p-4 mb-4">
          <p className="font-mono text-sm text-yellow-300 leading-relaxed">{message}</p>
        </div>
        
        <button
          onClick={handleRetry}
          className="group relative px-6 py-3 bg-yellow-600/80 hover:bg-yellow-500/80 text-black font-pixel text-sm rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <span className="text-lg">🔄</span>
            Retry Loading
          </span>
          
          {/* Pixel-style button border effect */}
          <div className="absolute inset-0 border-2 border-yellow-400/40 rounded group-hover:border-yellow-300/60 transition-colors" />
        </button>
        
        <p className="text-xs font-mono text-gray-500 mt-3">
          Status: <span className="text-yellow-400">SYSTEM ERROR</span> | 
          Action: <span className="text-blue-400">MANUAL RESTART</span>
        </p>
      </div>
    </div>
  )
}