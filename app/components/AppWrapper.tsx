"use client"

import { useState, useEffect } from "react"
import { LoadingExperience } from "./LoadingExperience"

interface AppWrapperProps {
  children: React.ReactNode
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showMainApp, setShowMainApp] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
    // Small delay to ensure smooth transition to main app
    setTimeout(() => {
      setShowMainApp(true)
    }, 300)
  }

  // Failsafe: automatically show main app after 10 seconds regardless of loading state
  useEffect(() => {
    const failsafeTimer = setTimeout(() => {
      console.warn('Loading timeout reached, showing main app')
      setIsLoading(false)
      setShowMainApp(true)
    }, 10000) // 10 second timeout

    return () => clearTimeout(failsafeTimer)
  }, [])

  // Only show loading experience or main app - never both
  if (isLoading || !showMainApp) {
    return isLoading ? (
      <LoadingExperience onComplete={handleLoadingComplete} />
    ) : (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="animate-pulse text-green-400 font-pixel">
          Initializing Interface...
        </div>
      </div>
    )
  }

  return <>{children}</>
} 