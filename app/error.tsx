'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 bg-gray-800 rounded-lg max-w-md">
        <h2 className="text-3xl font-pixel text-red-400 mb-4">System Error</h2>
        <div className="font-mono text-gray-300 mb-6">
          <p className="mb-2">
            The pixels have collided! Something went wrong on our end.
          </p>
          <p className="text-sm text-gray-400">
            Error ID: {error.digest || 'Unknown'}
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="px-6 py-2 bg-green-600 text-black font-pixel rounded hover:bg-green-500 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-2 bg-gray-700 text-green-400 font-pixel rounded hover:bg-gray-600 transition-colors inline-block"
          >
            Go Home
          </Link>
        </div>
        
        <details className="mt-6 text-left">
          <summary className="font-mono text-sm text-gray-400 cursor-pointer mb-2">
            Technical Details
          </summary>
          <pre className="font-mono text-xs text-red-300 bg-gray-900 p-3 rounded overflow-auto max-h-32">
            {error.message}
          </pre>
        </details>
      </div>
    </div>
  )
}
