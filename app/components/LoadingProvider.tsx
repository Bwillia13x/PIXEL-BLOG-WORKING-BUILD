"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { BriefLoadingScreen } from "./BriefLoadingScreen"

interface LoadingContextType {
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setLoading: () => {}
})

export const useLoading = () => useContext(LoadingContext)

interface LoadingProviderProps {
  children: React.ReactNode
  enableLoading?: boolean
  duration?: number
}

export function LoadingProvider({ 
  children, 
  enableLoading = true,
  duration = 2500 
}: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(enableLoading)
  const [showChildren, setShowChildren] = useState(!enableLoading)

  // Skip loading in development Fast Refresh or if disabled
  useEffect(() => {
    if (!enableLoading) {
      setIsLoading(false)
      setShowChildren(true)
      return
    }

    // In development, check for Fast Refresh or if page was already loaded
    if (process.env.NODE_ENV === 'development') {
      const hasExistingContent = document.querySelector('[data-loading-complete]')
      const isReload = sessionStorage.getItem('pixel-wisdom-loaded')
      
      if (hasExistingContent || isReload) {
        setIsLoading(false)
        setShowChildren(true)
        return
      }
    }
  }, [enableLoading])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    setShowChildren(true)
    // Mark that loading has completed
    document.body.setAttribute('data-loading-complete', 'true')
    // Store in session to prevent re-loading during development
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pixel-wisdom-loaded', 'true')
    }
  }

  const contextValue = {
    isLoading,
    setLoading: setIsLoading
  }

  return (
    <LoadingContext.Provider value={contextValue}>
      {isLoading && enableLoading && (
        <BriefLoadingScreen 
          onComplete={handleLoadingComplete}
          duration={duration}
        />
      )}
      {showChildren && (
        <div data-loading-complete="true">
          {children}
        </div>
      )}
    </LoadingContext.Provider>
  )
}