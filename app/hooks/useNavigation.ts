"use client"

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'

interface NavigationState {
  isOpen: boolean
  isMobile: boolean
  isScrolled: boolean
  activeSection: string
  breadcrumbs: Array<{ label: string; href: string }>
}

interface UseNavigationOptions {
  scrollThreshold?: number
  mobileBreakpoint?: number
  autoCloseOnRouteChange?: boolean
}

export function useNavigation(options: UseNavigationOptions = {}) {
  const {
    scrollThreshold = 100,
    mobileBreakpoint = 768,
    autoCloseOnRouteChange = true
  } = options

  const pathname = usePathname()
  
  const [navigationState, setNavigationState] = useState<NavigationState>({
    isOpen: false,
    isMobile: false,
    isScrolled: false,
    activeSection: '',
    breadcrumbs: []
  })

  // Handle viewport size changes
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < mobileBreakpoint
      setNavigationState(prev => ({ 
        ...prev, 
        isMobile,
        isOpen: isMobile ? prev.isOpen : false // Close mobile menu when switching to desktop
      }))
    }

    handleResize() // Initial check
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileBreakpoint])

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > scrollThreshold
      setNavigationState(prev => ({ ...prev, isScrolled }))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollThreshold])

  // Handle route changes
  useEffect(() => {
    if (autoCloseOnRouteChange) {
      setNavigationState(prev => ({ ...prev, isOpen: false }))
    }
  }, [pathname, autoCloseOnRouteChange])

  // Generate breadcrumbs from current path
  useEffect(() => {
    const generateBreadcrumbs = () => {
      const segments = pathname.split('/').filter(Boolean)
      const breadcrumbs = [{ label: 'Home', href: '/' }]
      
      let currentPath = ''
      segments.forEach(segment => {
        currentPath += `/${segment}`
        const label = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        
        breadcrumbs.push({
          label,
          href: currentPath
        })
      })
      
      return breadcrumbs
    }

    const breadcrumbs = generateBreadcrumbs()
    setNavigationState(prev => ({ ...prev, breadcrumbs }))
  }, [pathname])

  // Navigation controls
  const openNavigation = useCallback(() => {
    setNavigationState(prev => ({ ...prev, isOpen: true }))
  }, [])

  const closeNavigation = useCallback(() => {
    setNavigationState(prev => ({ ...prev, isOpen: false }))
  }, [])

  const toggleNavigation = useCallback(() => {
    setNavigationState(prev => ({ ...prev, isOpen: !prev.isOpen }))
  }, [])

  const setActiveSection = useCallback((section: string) => {
    setNavigationState(prev => ({ ...prev, activeSection: section }))
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close navigation
      if (e.key === 'Escape' && navigationState.isOpen) {
        closeNavigation()
      }
      
      // Ctrl/Cmd + M to toggle mobile menu
      if ((e.ctrlKey || e.metaKey) && e.key === 'm' && navigationState.isMobile) {
        e.preventDefault()
        toggleNavigation()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [navigationState.isOpen, navigationState.isMobile, closeNavigation, toggleNavigation])

  // Handle outside clicks on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!navigationState.isMobile || !navigationState.isOpen) return
      
      const target = e.target as HTMLElement
      const nav = target.closest('[data-navigation]')
      
      if (!nav) {
        closeNavigation()
      }
    }

    if (navigationState.isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [navigationState.isOpen, navigationState.isMobile, closeNavigation])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (navigationState.isMobile && navigationState.isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [navigationState.isMobile, navigationState.isOpen])

  // Focus management for accessibility
  const handleMenuItemFocus = useCallback((index: number, totalItems: number) => {
    return {
      onKeyDown: (e: React.KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            const nextIndex = (index + 1) % totalItems
            const nextElement = document.querySelector(`[data-nav-item="${nextIndex}"]`) as HTMLElement
            nextElement?.focus()
            break
            
          case 'ArrowUp':
            e.preventDefault()
            const prevIndex = index === 0 ? totalItems - 1 : index - 1
            const prevElement = document.querySelector(`[data-nav-item="${prevIndex}"]`) as HTMLElement
            prevElement?.focus()
            break
            
          case 'Home':
            e.preventDefault()
            const firstElement = document.querySelector('[data-nav-item="0"]') as HTMLElement
            firstElement?.focus()
            break
            
          case 'End':
            e.preventDefault()
            const lastElement = document.querySelector(`[data-nav-item="${totalItems - 1}"]`) as HTMLElement
            lastElement?.focus()
            break
        }
      }
    }
  }, [])

  return {
    ...navigationState,
    openNavigation,
    closeNavigation,
    toggleNavigation,
    setActiveSection,
    handleMenuItemFocus,
    
    // Utility functions
    isCurrentPage: (href: string) => {
      if (href === '/') return pathname === '/'
      return pathname.startsWith(href)
    },
    
    // Touch gesture support
    touchHandlers: {
      onTouchStart: (e: React.TouchEvent) => {
        const touch = e.touches[0]
        return { startX: touch.clientX, startY: touch.clientY }
      },
      
      onTouchEnd: (e: React.TouchEvent, startPosition: { startX: number; startY: number }) => {
        const touch = e.changedTouches[0]
        const deltaX = touch.clientX - startPosition.startX
        const deltaY = Math.abs(touch.clientY - startPosition.startY)
        
        // Swipe right to open menu (from left edge)
        if (deltaX > 50 && deltaY < 100 && startPosition.startX < 50) {
          openNavigation()
        }
        
        // Swipe left to close menu
        if (deltaX < -50 && deltaY < 100 && navigationState.isOpen) {
          closeNavigation()
        }
      }
    }
  }
}

export default useNavigation