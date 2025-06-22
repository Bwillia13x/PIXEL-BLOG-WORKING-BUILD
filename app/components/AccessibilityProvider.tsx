"use client"

import React, { createContext, useContext, useEffect } from 'react'
import { useAccessibility } from '../hooks/useAccessibility'

interface AccessibilityContextType {
  prefersReducedMotion: boolean
  prefersHighContrast: boolean
  isKeyboardUser: boolean
  isScreenReaderUser: boolean
  currentFocus: Element | null
  announcements: string[]
  announce: (message: string, priority?: 'polite' | 'assertive') => void
  focusElement: (selector: string | Element) => boolean
  getFocusableElements: (container?: Element) => HTMLElement[]
  trapFocusWithin: (container: Element) => () => void
  createSkipLink: (targetId: string, label?: string) => HTMLAnchorElement
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null)

interface AccessibilityProviderProps {
  children: React.ReactNode
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const accessibility = useAccessibility({
    respectMotionPreference: true,
    respectContrastPreference: true,
    announceRouteChanges: true,
    trapFocus: true
  })

  const { AnnouncementRegion } = accessibility

  // Add skip links on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Create skip links
    const skipToMain = accessibility.createSkipLink('main-content', 'Skip to main content')
    const skipToNav = accessibility.createSkipLink('main-navigation', 'Skip to navigation')
    
    // Insert skip links at the beginning of the body
    document.body.insertBefore(skipToMain, document.body.firstChild)
    document.body.insertBefore(skipToNav, document.body.firstChild)

    return () => {
      // Clean up skip links
      if (skipToMain.parentNode) {
        skipToMain.parentNode.removeChild(skipToMain)
      }
      if (skipToNav.parentNode) {
        skipToNav.parentNode.removeChild(skipToNav)
      }
    }
  }, [accessibility])

  // Add landmark roles to enhance navigation
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Ensure main content has proper landmark
    let main = document.querySelector('main')
    if (!main) {
      // Find likely main content container
      const candidates = [
        'div[class*="main"]',
        'div[id*="main"]',
        'div[class*="content"]',
        'article',
        'section'
      ]
      
      for (const selector of candidates) {
        const element = document.querySelector(selector)
        if (element && !element.closest('header, nav, aside, footer')) {
          element.setAttribute('role', 'main')
          element.id = element.id || 'main-content'
          break
        }
      }
    } else {
      main.id = main.id || 'main-content'
    }

    // Enhance navigation landmarks
    const navElements = document.querySelectorAll('nav')
    navElements.forEach((nav, index) => {
      if (!nav.getAttribute('aria-label')) {
        if (index === 0) {
          nav.setAttribute('aria-label', 'Main navigation')
          nav.id = nav.id || 'main-navigation'
        } else {
          nav.setAttribute('aria-label', `Navigation ${index + 1}`)
        }
      }
    })

    // Enhance section landmarks
    const sections = document.querySelectorAll('section')
    sections.forEach((section) => {
      const heading = section.querySelector('h1, h2, h3, h4, h5, h6')
      if (heading && !section.getAttribute('aria-labelledby')) {
        if (!heading.id) {
          heading.id = `heading-${Math.random().toString(36).substr(2, 9)}`
        }
        section.setAttribute('aria-labelledby', heading.id)
      }
    })
  }, [])

  return (
    <AccessibilityContext.Provider value={accessibility}>
      {children}
      <AnnouncementRegion />
    </AccessibilityContext.Provider>
  )
}

export function useAccessibilityContext() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibilityContext must be used within an AccessibilityProvider')
  }
  return context
}

// Enhanced focus management hook
export function useFocusManagement() {
  const { focusElement, getFocusableElements, trapFocusWithin } = useAccessibilityContext()

  const focusFirstElement = React.useCallback((container?: Element) => {
    const focusableElements = getFocusableElements(container)
    return focusElement(focusableElements[0])
  }, [focusElement, getFocusableElements])

  const focusLastElement = React.useCallback((container?: Element) => {
    const focusableElements = getFocusableElements(container)
    return focusElement(focusableElements[focusableElements.length - 1])
  }, [focusElement, getFocusableElements])

  const cycleTabIndex = React.useCallback((direction: 'forward' | 'backward', container?: Element) => {
    const focusableElements = getFocusableElements(container)
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement)
    
    let nextIndex: number
    if (direction === 'forward') {
      nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0
    } else {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1
    }
    
    return focusElement(focusableElements[nextIndex])
  }, [focusElement, getFocusableElements])

  return {
    focusElement,
    getFocusableElements,
    trapFocusWithin,
    focusFirstElement,
    focusLastElement,
    cycleTabIndex
  }
}

// Keyboard navigation hook
export function useKeyboardNavigation(handlers: {
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onEnter?: () => void
  onSpace?: () => void
  onEscape?: () => void
  onTab?: (direction: 'forward' | 'backward') => void
}) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (handlers.onArrowUp) {
            e.preventDefault()
            handlers.onArrowUp()
          }
          break
        case 'ArrowDown':
          if (handlers.onArrowDown) {
            e.preventDefault()
            handlers.onArrowDown()
          }
          break
        case 'ArrowLeft':
          if (handlers.onArrowLeft) {
            e.preventDefault()
            handlers.onArrowLeft()
          }
          break
        case 'ArrowRight':
          if (handlers.onArrowRight) {
            e.preventDefault()
            handlers.onArrowRight()
          }
          break
        case 'Enter':
          if (handlers.onEnter) {
            e.preventDefault()
            handlers.onEnter()
          }
          break
        case ' ':
          if (handlers.onSpace) {
            e.preventDefault()
            handlers.onSpace()
          }
          break
        case 'Escape':
          if (handlers.onEscape) {
            e.preventDefault()
            handlers.onEscape()
          }
          break
        case 'Tab':
          if (handlers.onTab) {
            e.preventDefault()
            handlers.onTab(e.shiftKey ? 'backward' : 'forward')
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handlers])
}

// Touch feedback hook for mobile
export function useTouchFeedback() {
  const { announce } = useAccessibilityContext()

  const provideTouchFeedback = React.useCallback((element: HTMLElement, message?: string) => {
    // Visual feedback
    element.style.transform = 'scale(0.95)'
    element.style.transition = 'transform 0.1s ease-out'
    
    setTimeout(() => {
      element.style.transform = 'scale(1)'
    }, 100)

    // Haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }

    // Audio feedback for screen readers
    if (message) {
      announce(message, 'polite')
    }
  }, [announce])

  return { provideTouchFeedback }
}