"use client"

import { useState, useEffect, useCallback } from 'react'

interface BackgroundSettings {
  enabled: boolean
  layers: {
    matrix: boolean
    particles: boolean
    geometric: boolean
  }
  intensity: 'low' | 'medium' | 'high'
  interactive: boolean
  performance: 'optimized' | 'balanced' | 'quality'
}

const DEFAULT_SETTINGS: BackgroundSettings = {
  enabled: true,
  layers: {
    matrix: true,
    particles: true,
    geometric: false
  },
  intensity: 'medium',
  interactive: true,
  performance: 'balanced'
}

const STORAGE_KEY = 'pixel-wisdom-background-settings'

export function useBackgroundSettings() {
  const [settings, setSettings] = useState<BackgroundSettings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedSettings = JSON.parse(stored)
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings })
      }
    } catch (error) {
      console.warn('Failed to load background settings:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = useCallback((newSettings: Partial<BackgroundSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings))
    } catch (error) {
      console.warn('Failed to save background settings:', error)
    }
  }, [settings])

  // Convenience methods
  const toggleBackground = useCallback(() => {
    saveSettings({ enabled: !settings.enabled })
  }, [settings.enabled, saveSettings])

  const toggleLayer = useCallback((layer: keyof BackgroundSettings['layers']) => {
    saveSettings({
      layers: {
        ...settings.layers,
        [layer]: !settings.layers[layer]
      }
    })
  }, [settings.layers, saveSettings])

  const setIntensity = useCallback((intensity: BackgroundSettings['intensity']) => {
    saveSettings({ intensity })
  }, [saveSettings])

  const setPerformance = useCallback((performance: BackgroundSettings['performance']) => {
    saveSettings({ performance })
  }, [saveSettings])

  const toggleInteractivity = useCallback(() => {
    saveSettings({ interactive: !settings.interactive })
  }, [settings.interactive, saveSettings])

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to reset background settings:', error)
    }
  }, [])

  // Performance-based auto-adjustments
  const enablePerformanceMode = useCallback(() => {
    saveSettings({
      layers: {
        matrix: true,
        particles: false,
        geometric: false
      },
      intensity: 'low',
      performance: 'optimized',
      interactive: false
    })
  }, [saveSettings])

  return {
    settings,
    isLoaded,
    saveSettings,
    toggleBackground,
    toggleLayer,
    setIntensity,
    setPerformance,
    toggleInteractivity,
    resetToDefaults,
    enablePerformanceMode
  }
}

export default useBackgroundSettings