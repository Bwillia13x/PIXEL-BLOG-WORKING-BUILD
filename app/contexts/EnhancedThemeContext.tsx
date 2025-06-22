"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { themeVariants, getContextualTheme, generateCSSProperties, type ThemeVariant } from '../styles/themes'

interface ThemeContextType {
  currentTheme: string
  themeVariant: ThemeVariant
  setTheme: (theme: string) => void
  isLoading: boolean
  isDarkMode: boolean
  setDarkMode: (dark: boolean) => void
  isSeasonalMode: boolean
  setSeasonalMode: (seasonal: boolean) => void
  isHighContrast: boolean
  setHighContrast: (highContrast: boolean) => void
  availableThemes: string[]
  themeTransition: boolean
}

const ThemeContext = createContext<ThemeContextType | null>(null)

interface EnhancedThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: string
}

export function EnhancedThemeProvider({ children, defaultTheme }: EnhancedThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<string>(defaultTheme || 'default')
  const [isLoading, setIsLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(true) // Always dark for pixel aesthetic
  const [isSeasonalMode, setIsSeasonalMode] = useState(false)
  const [isHighContrast, setIsHighContrast] = useState(false)
  const [themeTransition, setThemeTransition] = useState(false)

  // Memoize theme variant to prevent unnecessary recalculations
  const themeVariant = useMemo(() => {
    if (isHighContrast) {
      return themeVariants.highContrast
    }
    return themeVariants[currentTheme] || themeVariants.default
  }, [currentTheme, isHighContrast])

  const availableThemes = useMemo(() => {
    return Object.keys(themeVariants).filter(key => key !== 'highContrast')
  }, [])

  // Optimized CSS property application
  const applyCSSProperties = useCallback((theme: ThemeVariant) => {
    const properties = generateCSSProperties(theme)
    const root = document.documentElement
    
    // Use requestAnimationFrame for smooth property updates
    requestAnimationFrame(() => {
      Object.entries(properties).forEach(([property, value]) => {
        root.style.setProperty(property, value)
      })
    })
  }, [])

  // Enhanced theme setting with transition management
  const setTheme = useCallback((theme: string) => {
    if (theme === currentTheme) return
    
    setThemeTransition(true)
    
    // Add transition class for smooth color changes
    document.documentElement.classList.add('theme-transitioning')
    
    setTimeout(() => {
      setCurrentTheme(theme)
      
      // Remove transition class after theme change
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning')
        setThemeTransition(false)
      }, 300)
    }, 50)
  }, [currentTheme])

  // High contrast toggle
  const setHighContrast = useCallback((highContrast: boolean) => {
    setIsHighContrast(highContrast)
    
    // Store preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('high-contrast', highContrast.toString())
    }
  }, [])

  // Seasonal mode toggle
  const setSeasonalMode = useCallback((seasonal: boolean) => {
    setIsSeasonalMode(seasonal)
    
    if (seasonal) {
      const contextualTheme = getContextualTheme()
      setTheme(contextualTheme)
    } else {
      setTheme('default')
    }
    
    // Store preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('seasonal-mode', seasonal.toString())
    }
  }, [setTheme])

  // Initialize theme from preferences and system settings
  useEffect(() => {
    if (typeof window === 'undefined') return

    const initializeTheme = () => {
      // Check for stored preferences
      const storedTheme = localStorage.getItem('theme')
      const storedSeasonalMode = localStorage.getItem('seasonal-mode') === 'true'
      const storedHighContrast = localStorage.getItem('high-contrast') === 'true'
      
      // Check system preferences
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      
      // Set high contrast if system prefers it or stored preference
      if (prefersHighContrast || storedHighContrast) {
        setIsHighContrast(true)
      }
      
      // Set seasonal mode from stored preference
      setIsSeasonalMode(storedSeasonalMode)
      
      // Determine initial theme
      let initialTheme = 'default'
      
      if (storedSeasonalMode) {
        initialTheme = getContextualTheme()
      } else if (storedTheme && themeVariants[storedTheme]) {
        initialTheme = storedTheme
      }
      
      setCurrentTheme(initialTheme)
      setIsLoading(false)
    }

    // Initialize with a small delay to prevent flash
    const timer = setTimeout(initializeTheme, 50)
    
    return () => clearTimeout(timer)
  }, [])

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    const handleContrastChange = (e: MediaQueryListEvent) => {
      if (e.matches && !isHighContrast) {
        setHighContrast(true)
      }
    }
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      // Add reduced motion class to document
      if (e.matches) {
        document.documentElement.classList.add('reduce-motion')
      } else {
        document.documentElement.classList.remove('reduce-motion')
      }
    }

    contrastQuery.addEventListener('change', handleContrastChange)
    motionQuery.addEventListener('change', handleMotionChange)
    
    // Initialize motion preference
    if (motionQuery.matches) {
      document.documentElement.classList.add('reduce-motion')
    }

    return () => {
      contrastQuery.removeEventListener('change', handleContrastChange)
      motionQuery.removeEventListener('change', handleMotionChange)
    }
  }, [isHighContrast, setHighContrast])

  // Apply CSS properties when theme changes
  useEffect(() => {
    if (!isLoading) {
      applyCSSProperties(themeVariant)
      
      // Store current theme (unless it's auto-seasonal)
      if (typeof window !== 'undefined' && !isSeasonalMode) {
        localStorage.setItem('theme', currentTheme)
      }
    }
  }, [themeVariant, isLoading, currentTheme, isSeasonalMode, applyCSSProperties])

  // Auto-update seasonal theme
  useEffect(() => {
    if (!isSeasonalMode) return

    const updateSeasonalTheme = () => {
      const contextualTheme = getContextualTheme()
      if (contextualTheme !== currentTheme) {
        setCurrentTheme(contextualTheme)
      }
    }

    // Check for theme changes daily
    const interval = setInterval(updateSeasonalTheme, 24 * 60 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [isSeasonalMode, currentTheme])

  // Add global CSS for theme transitions
  useEffect(() => {
    if (typeof window === 'undefined') return

    const style = document.createElement('style')
    style.textContent = `
      :root {
        /* Smooth theme transitions */
        transition: none;
      }
      
      .theme-transitioning * {
        transition: 
          color var(--duration-normal) var(--easing-ease),
          background-color var(--duration-normal) var(--easing-ease),
          border-color var(--duration-normal) var(--easing-ease),
          box-shadow var(--duration-normal) var(--easing-ease) !important;
      }
      
      /* Reduce motion for users who prefer it */
      .reduce-motion *,
      .reduce-motion *::before,
      .reduce-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
      
      /* Enhanced focus indicators for high contrast */
      .high-contrast *:focus {
        outline: 3px solid var(--color-border-focus) !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 6px rgba(255, 255, 0, 0.3) !important;
      }
    `
    
    document.head.appendChild(style)
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])

  // Add theme classes to document
  useEffect(() => {
    const classList = document.documentElement.classList
    
    // Remove all theme classes
    availableThemes.forEach(theme => {
      classList.remove(`theme-${theme}`)
    })
    
    // Add current theme class
    classList.add(`theme-${currentTheme}`)
    
    // Add state classes
    classList.toggle('high-contrast', isHighContrast)
    classList.toggle('seasonal-mode', isSeasonalMode)
    classList.toggle('dark-mode', isDarkMode)
  }, [currentTheme, isHighContrast, isSeasonalMode, isDarkMode, availableThemes])

  const contextValue = useMemo(() => ({
    currentTheme,
    themeVariant,
    setTheme,
    isLoading,
    isDarkMode,
    setDarkMode: setIsDarkMode,
    isSeasonalMode,
    setSeasonalMode,
    isHighContrast,
    setHighContrast,
    availableThemes,
    themeTransition
  }), [
    currentTheme,
    themeVariant,
    setTheme,
    isLoading,
    isDarkMode,
    isSeasonalMode,
    setSeasonalMode,
    isHighContrast,
    setHighContrast,
    availableThemes,
    themeTransition
  ])

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useEnhancedTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useEnhancedTheme must be used within an EnhancedThemeProvider')
  }
  return context
}

// Hook for theme-aware CSS classes
export function useThemeClasses() {
  const { currentTheme, isHighContrast, themeTransition } = useEnhancedTheme()
  
  return useMemo(() => ({
    theme: `theme-${currentTheme}`,
    highContrast: isHighContrast ? 'high-contrast' : '',
    transitioning: themeTransition ? 'theme-transitioning' : '',
    base: `theme-${currentTheme} ${isHighContrast ? 'high-contrast' : ''} ${themeTransition ? 'theme-transitioning' : ''}`.trim()
  }), [currentTheme, isHighContrast, themeTransition])
}

// Hook for accessing theme colors programmatically
export function useThemeColors() {
  const { themeVariant } = useEnhancedTheme()
  
  return useMemo(() => themeVariant.colors, [themeVariant])
}

export default EnhancedThemeProvider