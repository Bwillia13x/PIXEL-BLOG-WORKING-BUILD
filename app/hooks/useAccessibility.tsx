"use client"

import React, { useEffect, useState, useCallback, useRef } from 'react'

interface AccessibilityOptions {
  respectMotionPreference?: boolean
  respectContrastPreference?: boolean
  announceRouteChanges?: boolean
  trapFocus?: boolean
}

interface AccessibilityState {
  prefersReducedMotion: boolean
  prefersHighContrast: boolean
  isKeyboardUser: boolean
  isScreenReaderUser: boolean
  currentFocus: Element | null
  announcements: string[]
}

export function useAccessibility(options: AccessibilityOptions = {}) {
  const {
    respectMotionPreference = true,
    respectContrastPreference = true,
    announceRouteChanges = true,
    trapFocus = false
  } = options

  const [state, setState] = useState<AccessibilityState>({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    isKeyboardUser: false,
    isScreenReaderUser: false,
    currentFocus: null,
    announcements: []
  })

  const announcementRef = useRef<HTMLDivElement>(null)
  const focusTrapRef = useRef<HTMLElement[]>([])

  // Detect user preferences
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkPreferences = () => {
      setState(prev => ({
        ...prev,
        prefersReducedMotion: respectMotionPreference && 
          window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        prefersHighContrast: respectContrastPreference && 
          window.matchMedia('(prefers-contrast: high)').matches,
        isScreenReaderUser: 'speechSynthesis' in window || 
          navigator.userAgent.includes('NVDA') ||
          navigator.userAgent.includes('JAWS') ||
          navigator.userAgent.includes('VoiceOver')
      }))
    }

    checkPreferences()

    // Listen for preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')

    const handleMotionChange = () => checkPreferences()
    const handleContrastChange = () => checkPreferences()

    motionQuery.addEventListener('change', handleMotionChange)
    contrastQuery.addEventListener('change', handleContrastChange)

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange)
      contrastQuery.removeEventListener('change', handleContrastChange)
    }
  }, [respectMotionPreference, respectContrastPreference])

  // Detect keyboard usage
  useEffect(() => {
    if (typeof window === 'undefined') return

    let isKeyboard = false

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ' || e.key.startsWith('Arrow')) {
        isKeyboard = true
        setState(prev => ({ ...prev, isKeyboardUser: true }))
        document.body.classList.add('keyboard-user')
      }
    }

    const handleMouseDown = () => {
      if (isKeyboard) {
        isKeyboard = false
        setState(prev => ({ ...prev, isKeyboardUser: false }))
        document.body.classList.remove('keyboard-user')
      }
    }

    const handleFocusIn = (e: FocusEvent) => {
      setState(prev => ({ ...prev, currentFocus: e.target as Element }))
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('focusin', handleFocusIn)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('focusin', handleFocusIn)
    }
  }, [])

  // Announce messages to screen readers
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcementRef.current) return

    setState(prev => ({
      ...prev,
      announcements: [...prev.announcements, message]
    }))

    // Create announcement element
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    announcementRef.current.appendChild(announcement)

    // Clean up after announcement
    setTimeout(() => {
      if (announcementRef.current && announcement.parentNode) {
        announcementRef.current.removeChild(announcement)
      }
      setState(prev => ({
        ...prev,
        announcements: prev.announcements.filter(a => a !== message)
      }))
    }, 1000)
  }, [])

  // Focus management utilities
  const focusElement = useCallback((selector: string | Element) => {
    const element = typeof selector === 'string' 
      ? document.querySelector(selector) as HTMLElement
      : selector as HTMLElement

    if (element && typeof element.focus === 'function') {
      element.focus()
      return true
    }
    return false
  }, [])

  const getFocusableElements = useCallback((container?: Element) => {
    const root = container || document
    const focusableSelector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      'summary',
      'details[open] summary',
      '[contenteditable="true"]'
    ].join(', ')

    return Array.from(root.querySelectorAll(focusableSelector)) as HTMLElement[]
  }, [])

  // Focus trap for modals/menus
  const trapFocusWithin = useCallback((container: Element) => {
    if (!trapFocus) return () => {}

    const focusableElements = getFocusableElements(container)
    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault()
          lastFocusable?.focus()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault()
          firstFocusable?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown as EventListener)
    
    // Focus first element
    firstFocusable?.focus()

    return () => {
      container.removeEventListener('keydown', handleKeyDown as EventListener)
    }
  }, [trapFocus, getFocusableElements])

  // Skip link functionality
  const createSkipLink = useCallback((targetId: string, label: string = 'Skip to main content') => {
    const skipLink = document.createElement('a')
    skipLink.href = `#${targetId}`
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-green-600 focus:text-black focus:font-pixel focus:text-sm focus:rounded-lg focus:border-2 focus:border-green-400 focus:outline-none'
    skipLink.textContent = label
    
    skipLink.addEventListener('click', (e) => {
      e.preventDefault()
      const target = document.getElementById(targetId)
      if (target) {
        target.focus()
        target.scrollIntoView({ behavior: 'smooth' })
      }
    })

    return skipLink
  }, [])

  // Route change announcements
  useEffect(() => {
    if (!announceRouteChanges || typeof window === 'undefined') return

    const handleRouteChange = () => {
      const title = document.title
      announce(`Navigated to ${title}`, 'polite')
    }

    // Listen for route changes (for SPA navigation)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.target === document.head) {
          const titleElement = document.querySelector('title')
          if (titleElement) {
            handleRouteChange()
          }
        }
      })
    })

    observer.observe(document.head, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [announceRouteChanges, announce])

  // Dynamic CSS for accessibility preferences
  useEffect(() => {
    if (typeof window === 'undefined') return

    const style = document.createElement('style')
    style.id = 'accessibility-styles'
    
    let css = `
      /* Keyboard focus indicators */
      body.keyboard-user *:focus {
        outline: 2px solid #4ade80 !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 4px rgba(74, 222, 128, 0.2) !important;
      }

      /* Screen reader only content */
      .sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }

      .sr-only.focus\\:not-sr-only:focus {
        position: static !important;
        width: auto !important;
        height: auto !important;
        padding: inherit !important;
        margin: inherit !important;
        overflow: visible !important;
        clip: auto !important;
        white-space: normal !important;
      }

      /* Touch target improvements */
      @media (hover: none) {
        button, a, input, textarea, select {
          min-height: 44px !important;
          min-width: 44px !important;
        }
      }
    `

    // Reduced motion styles
    if (state.prefersReducedMotion) {
      css += `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      `
    }

    // High contrast styles
    if (state.prefersHighContrast) {
      css += `
        * {
          border-color: currentColor !important;
        }
        
        .text-gray-300, .text-gray-400, .text-gray-500 {
          color: #ffffff !important;
        }
        
        .bg-gray-800, .bg-gray-900 {
          background-color: #000000 !important;
        }
      `
    }

    style.textContent = css
    document.head.appendChild(style)

    return () => {
      const existingStyle = document.getElementById('accessibility-styles')
      if (existingStyle) {
        document.head.removeChild(existingStyle)
      }
    }
  }, [state.prefersReducedMotion, state.prefersHighContrast])

  return {
    ...state,
    announce,
    focusElement,
    getFocusableElements,
    trapFocusWithin,
    createSkipLink,
    // Component for announcements
    AnnouncementRegion: () => (
      <div
        ref={announcementRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    )
  }
}