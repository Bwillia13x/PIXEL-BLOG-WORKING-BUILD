'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { ThemeConfig, DEFAULT_THEME, getThemeById, getAllThemes, validateTheme, exportTheme, importTheme } from '@/app/lib/themes'

interface ThemeContextType {
  // Current theme state
  currentTheme: ThemeConfig
  isTransitioning: boolean
  
  // Theme management
  setTheme: (themeId: string) => void
  previewTheme: (themeId: string) => void
  cancelPreview: () => void
  applyPreview: () => void
  
  // Theme operations
  exportCurrentTheme: () => string
  importTheme: (jsonString: string) => boolean
  createCustomTheme: (theme: Partial<ThemeConfig>) => boolean
  deleteCustomTheme: (themeId: string) => boolean
  
  // Available themes
  availableThemes: ThemeConfig[]
  customThemes: ThemeConfig[]
  
  // Preferences
  preferences: {
    enableTransitions: boolean
    enableEffects: boolean
    autoSave: boolean
    previewMode: boolean
  }
  updatePreferences: (prefs: Partial<ThemeContextType['preferences']>) => void
  
  // Accessibility
  accessibilityMode: boolean
  setAccessibilityMode: (enabled: boolean) => void
  
  // Animation control
  reduceMotion: boolean
  setReduceMotion: (enabled: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEYS = {
  CURRENT_THEME: 'pixel-blog-current-theme',
  CUSTOM_THEMES: 'pixel-blog-custom-themes',
  PREFERENCES: 'pixel-blog-theme-preferences',
  ACCESSIBILITY: 'pixel-blog-accessibility-mode',
  REDUCE_MOTION: 'pixel-blog-reduce-motion'
}

const DEFAULT_PREFERENCES = {
  enableTransitions: true,
  enableEffects: true,
  autoSave: true,
  previewMode: false
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(DEFAULT_THEME)
  const [previewTheme, setPreviewTheme] = useState<ThemeConfig | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [customThemes, setCustomThemes] = useState<ThemeConfig[]>([])
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES)
  const [accessibilityMode, setAccessibilityModeState] = useState(false)
  const [reduceMotion, setReduceMotionState] = useState(false)
  
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const rootElementRef = useRef<HTMLElement | null>(null)

  // Initialize root element reference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      rootElementRef.current = document.documentElement
    }
  }, [])

  // Load saved data on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      // Load current theme
      const savedThemeId = localStorage.getItem(STORAGE_KEYS.CURRENT_THEME)
      if (savedThemeId) {
        const savedTheme = getThemeById(savedThemeId)
        if (savedTheme) {
          setCurrentTheme(savedTheme)
        }
      }

      // Load custom themes
      const savedCustomThemes = localStorage.getItem(STORAGE_KEYS.CUSTOM_THEMES)
      if (savedCustomThemes) {
        const customThemesList = JSON.parse(savedCustomThemes)
        setCustomThemes(customThemesList.filter(validateTheme))
      }

      // Load preferences
      const savedPreferences = localStorage.getItem(STORAGE_KEYS.PREFERENCES)
      if (savedPreferences) {
        setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(savedPreferences) })
      }

      // Load accessibility settings
      const savedAccessibility = localStorage.getItem(STORAGE_KEYS.ACCESSIBILITY)
      if (savedAccessibility) {
        setAccessibilityModeState(JSON.parse(savedAccessibility))
      }

      // Load motion preferences
      const savedReduceMotion = localStorage.getItem(STORAGE_KEYS.REDUCE_MOTION)
      if (savedReduceMotion) {
        setReduceMotionState(JSON.parse(savedReduceMotion))
      }

      // Check system preferences for reduced motion
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReduceMotionState(mediaQuery.matches)
      
      const handleMotionChange = (e: MediaQueryListEvent) => {
        setReduceMotionState(e.matches)
      }
      
      mediaQuery.addEventListener('change', handleMotionChange)
      return () => mediaQuery.removeEventListener('change', handleMotionChange)
    } catch (error) {
      console.error('Error loading theme data:', error)
    }
  }, [])

  // Apply CSS custom properties to document root
  const applyCSSProperties = useCallback((theme: ThemeConfig, isPreview = false) => {
    if (!rootElementRef.current) return

    const root = rootElementRef.current
    const prefix = isPreview ? '--preview-' : '--theme-'

    // Apply color properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`${prefix}${key}`, value)
    })

    // Apply font properties
    Object.entries(theme.fonts).forEach(([key, value]) => {
      root.style.setProperty(`${prefix}font-${key}`, value)
    })

    // Apply effect properties
    Object.entries(theme.effects).forEach(([key, value]) => {
      root.style.setProperty(`${prefix}effect-${key}`, value.toString())
    })

    // Apply accessibility properties
    Object.entries(theme.accessibility).forEach(([key, value]) => {
      root.style.setProperty(`${prefix}a11y-${key}`, value.toString())
    })

    // Apply theme class
    const themeClass = `theme-${theme.id}`
    if (!isPreview) {
      // Remove all existing theme classes
      root.className = root.className.replace(/theme-\w+/g, '')
      root.classList.add(themeClass)
    } else {
      root.classList.add(`preview-${themeClass}`)
    }
  }, [])

  // Remove preview CSS properties
  const removePreviewProperties = useCallback(() => {
    if (!rootElementRef.current) return

    const root = rootElementRef.current
    const styles = root.style

    // Remove preview CSS properties
    for (let i = styles.length - 1; i >= 0; i--) {
      const property = styles[i]
      if (property.startsWith('--preview-')) {
        root.style.removeProperty(property)
      }
    }

    // Remove preview classes
    root.className = root.className.replace(/preview-theme-\w+/g, '')
  }, [])

  // Apply theme with transition
  const applyThemeWithTransition = useCallback((theme: ThemeConfig) => {
    if (!preferences.enableTransitions || reduceMotion) {
      applyCSSProperties(theme)
      return
    }

    setIsTransitioning(true)
    
    // Clear any existing transition timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current)
    }

    // Apply transition class
    if (rootElementRef.current) {
      rootElementRef.current.classList.add('theme-transitioning')
    }

    // Apply new theme
    applyCSSProperties(theme)

    // Remove transition class after animation completes
    transitionTimeoutRef.current = setTimeout(() => {
      if (rootElementRef.current) {
        rootElementRef.current.classList.remove('theme-transitioning')
      }
      setIsTransitioning(false)
    }, 300) // Match CSS transition duration
  }, [preferences.enableTransitions, reduceMotion, applyCSSProperties])

  // Apply current theme when it changes
  useEffect(() => {
    applyThemeWithTransition(currentTheme)
    
    // Save to localStorage if auto-save is enabled
    if (preferences.autoSave) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_THEME, currentTheme.id)
    }
  }, [currentTheme, applyThemeWithTransition, preferences.autoSave])

  // Theme management functions
  const setTheme = useCallback((themeId: string) => {
    const theme = getThemeById(themeId) || customThemes.find(t => t.id === themeId)
    if (theme) {
      setCurrentTheme(theme)
      setPreviewTheme(null)
      removePreviewProperties()
    }
  }, [customThemes, removePreviewProperties])

  const previewThemeHandler = useCallback((themeId: string) => {
    const theme = getThemeById(themeId) || customThemes.find(t => t.id === themeId)
    if (theme) {
      setPreviewTheme(theme)
      applyCSSProperties(theme, true)
    }
  }, [customThemes, applyCSSProperties])

  const cancelPreview = useCallback(() => {
    setPreviewTheme(null)
    removePreviewProperties()
  }, [removePreviewProperties])

  const applyPreview = useCallback(() => {
    if (previewTheme) {
      setCurrentTheme(previewTheme)
      setPreviewTheme(null)
      removePreviewProperties()
    }
  }, [previewTheme, removePreviewProperties])

  // Theme operations
  const exportCurrentTheme = useCallback(() => {
    return exportTheme(currentTheme)
  }, [currentTheme])

  const importThemeHandler = useCallback((jsonString: string) => {
    const theme = importTheme(jsonString)
    if (theme) {
      // Add to custom themes if it's not a built-in theme
      if (!getThemeById(theme.id)) {
        const newCustomThemes = [...customThemes, theme]
        setCustomThemes(newCustomThemes)
        localStorage.setItem(STORAGE_KEYS.CUSTOM_THEMES, JSON.stringify(newCustomThemes))
      }
      return true
    }
    return false
  }, [customThemes])

  const createCustomTheme = useCallback((themeData: Partial<ThemeConfig>) => {
    if (!validateTheme(themeData)) return false

    const theme = themeData as ThemeConfig
    const newCustomThemes = [...customThemes, theme]
    setCustomThemes(newCustomThemes)
    localStorage.setItem(STORAGE_KEYS.CUSTOM_THEMES, JSON.stringify(newCustomThemes))
    return true
  }, [customThemes])

  const deleteCustomTheme = useCallback((themeId: string) => {
    const newCustomThemes = customThemes.filter(t => t.id !== themeId)
    setCustomThemes(newCustomThemes)
    localStorage.setItem(STORAGE_KEYS.CUSTOM_THEMES, JSON.stringify(newCustomThemes))
    
    // If the deleted theme was current, switch to default
    if (currentTheme.id === themeId) {
      setCurrentTheme(DEFAULT_THEME)
    }
    return true
  }, [customThemes, currentTheme.id])

  // Preferences
  const updatePreferences = useCallback((newPrefs: Partial<typeof preferences>) => {
    const updatedPrefs = { ...preferences, ...newPrefs }
    setPreferences(updatedPrefs)
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updatedPrefs))
  }, [preferences])

  // Accessibility
  const setAccessibilityMode = useCallback((enabled: boolean) => {
    setAccessibilityModeState(enabled)
    localStorage.setItem(STORAGE_KEYS.ACCESSIBILITY, JSON.stringify(enabled))
    
    // Apply accessibility modifications to current theme
    if (rootElementRef.current) {
      if (enabled) {
        rootElementRef.current.classList.add('accessibility-mode')
      } else {
        rootElementRef.current.classList.remove('accessibility-mode')
      }
    }
  }, [])

  const setReduceMotion = useCallback((enabled: boolean) => {
    setReduceMotionState(enabled)
    localStorage.setItem(STORAGE_KEYS.REDUCE_MOTION, JSON.stringify(enabled))
    
    if (rootElementRef.current) {
      if (enabled) {
        rootElementRef.current.classList.add('reduce-motion')
      } else {
        rootElementRef.current.classList.remove('reduce-motion')
      }
    }
  }, [])

  // Cleanup
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }
    }
  }, [])

  const value: ThemeContextType = {
    currentTheme: previewTheme || currentTheme,
    isTransitioning,
    setTheme,
    previewTheme: previewThemeHandler,
    cancelPreview,
    applyPreview,
    exportCurrentTheme,
    importTheme: importThemeHandler,
    createCustomTheme,
    deleteCustomTheme,
    availableThemes: getAllThemes(),
    customThemes,
    preferences,
    updatePreferences,
    accessibilityMode,
    setAccessibilityMode,
    reduceMotion,
    setReduceMotion
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Hook for accessing theme CSS properties
export function useThemeProperties() {
  const { currentTheme } = useTheme()
  
  return {
    cssVar: (property: string) => `var(--theme-${property})`,
    getColor: (colorKey: keyof typeof currentTheme.colors) => currentTheme.colors[colorKey],
    getFont: (fontKey: keyof typeof currentTheme.fonts) => currentTheme.fonts[fontKey],
    hasEffect: (effectKey: keyof typeof currentTheme.effects) => currentTheme.effects[effectKey]
  }
}