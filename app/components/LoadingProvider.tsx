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
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showChildren, setShowChildren] = useState(false)

  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
    
    if (!enableLoading) {
      setIsLoading(false)
      setShowChildren(true)
      return
    }

    // Check if we should skip loading
    const hasExistingContent = document.querySelector('[data-loading-complete]')
    const isReload = sessionStorage.getItem('pixel-wisdom-loaded')
    
    if (hasExistingContent || isReload) {
      setIsLoading(false)
      setShowChildren(true)
    } else {
      setIsLoading(true)
      setShowChildren(false)
    }
  }, [enableLoading])

  // Manage body class for loading state
  useEffect(() => {
    if (!isMounted) return

    if (isLoading && enableLoading) {
      document.body.classList.add('loading-active')
      // Prevent scroll restoration during loading
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual'
      }
    } else {
      document.body.classList.remove('loading-active')
      // Restore scroll behavior
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto'
      }
    }

    return () => {
      document.body.classList.remove('loading-active')
    }
  }, [isLoading, enableLoading, isMounted])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    setShowChildren(true)
    
    // Clean up loading state
    if (typeof window !== 'undefined') {
      document.body.classList.remove('loading-active')
      document.body.setAttribute('data-loading-complete', 'true')
      sessionStorage.setItem('pixel-wisdom-loaded', 'true')
      
      // Smooth scroll to top after loading
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const contextValue = {
    isLoading,
    setLoading: setIsLoading
  }

  // Don't render anything until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <LoadingContext.Provider value={contextValue}>
        <div data-loading-complete="true">
          {children}
        </div>
      </LoadingContext.Provider>
    )
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