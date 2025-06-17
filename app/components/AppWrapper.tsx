"use client"

import { useState } from "react"
import { LoadingExperience } from "./LoadingExperience"

interface AppWrapperProps {
  children: React.ReactNode
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showMainApp, setShowMainApp] = useState(false)

  const handleLoadingComplete = () => {
    setIsLoading(false)
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setShowMainApp(true)
    }, 300)
  }

  // For development, you can uncomment this to skip loading
  // useEffect(() => {
  //   handleLoadingComplete()
  // }, [])

  // Only show loading experience or main app - never both
  if (isLoading || !showMainApp) {
    return isLoading ? (
      <LoadingExperience onComplete={handleLoadingComplete} />
    ) : (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-green-400 font-pixel">
          Initializing...
        </div>
      </div>
    )
  }

  return <>{children}</>
} 