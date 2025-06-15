'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; reset?: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent 
        error={this.state.error} 
        reset={() => this.setState({ hasError: false })} 
      />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error?: Error; reset?: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center p-8 bg-gray-800 rounded-lg max-w-md">
        <h2 className="text-2xl font-pixel text-red-400 mb-4">Game Over!</h2>
        <p className="font-mono text-gray-300 mb-4">
          Something went wrong. This shouldn&apos;t happen in a pixel-perfect world.
        </p>
        {error && (
          <details className="mb-4 text-left">
            <summary className="font-mono text-sm text-gray-400 cursor-pointer">
              Error Details
            </summary>
            <pre className="font-mono text-xs text-red-300 mt-2 overflow-auto max-h-32">
              {error.message}
            </pre>
          </details>
        )}
        <div className="flex gap-2 justify-center">
          {reset && (
            <button
              onClick={reset}
              className="px-4 py-2 bg-green-600 text-black font-pixel text-sm rounded hover:bg-green-500 transition-colors"
            >
              Try Again
            </button>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-700 text-green-400 font-pixel text-sm rounded hover:bg-gray-600 transition-colors"
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorBoundary
