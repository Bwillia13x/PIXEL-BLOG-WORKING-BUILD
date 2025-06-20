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
      }))\n    }\n\n    handleResize() // Initial check\n    window.addEventListener('resize', handleResize)\n    return () => window.removeEventListener('resize', handleResize)\n  }, [mobileBreakpoint])\n\n  // Handle scroll events\n  useEffect(() => {\n    const handleScroll = () => {\n      const isScrolled = window.scrollY > scrollThreshold\n      setNavigationState(prev => ({ ...prev, isScrolled }))\n    }\n\n    window.addEventListener('scroll', handleScroll, { passive: true })\n    return () => window.removeEventListener('scroll', handleScroll)\n  }, [scrollThreshold])\n\n  // Handle route changes\n  useEffect(() => {\n    if (autoCloseOnRouteChange) {\n      setNavigationState(prev => ({ ...prev, isOpen: false }))\n    }\n  }, [pathname, autoCloseOnRouteChange])\n\n  // Generate breadcrumbs from current path\n  useEffect(() => {\n    const generateBreadcrumbs = () => {\n      const segments = pathname.split('/').filter(Boolean)\n      const breadcrumbs = [{ label: 'Home', href: '/' }]\n      \n      let currentPath = ''\n      segments.forEach(segment => {\n        currentPath += `/${segment}`\n        const label = segment\n          .split('-')\n          .map(word => word.charAt(0).toUpperCase() + word.slice(1))\n          .join(' ')\n        \n        breadcrumbs.push({\n          label,\n          href: currentPath\n        })\n      })\n      \n      return breadcrumbs\n    }\n\n    const breadcrumbs = generateBreadcrumbs()\n    setNavigationState(prev => ({ ...prev, breadcrumbs }))\n  }, [pathname])\n\n  // Navigation controls\n  const openNavigation = useCallback(() => {\n    setNavigationState(prev => ({ ...prev, isOpen: true }))\n  }, [])\n\n  const closeNavigation = useCallback(() => {\n    setNavigationState(prev => ({ ...prev, isOpen: false }))\n  }, [])\n\n  const toggleNavigation = useCallback(() => {\n    setNavigationState(prev => ({ ...prev, isOpen: !prev.isOpen }))\n  }, [])\n\n  const setActiveSection = useCallback((section: string) => {\n    setNavigationState(prev => ({ ...prev, activeSection: section }))\n  }, [])\n\n  // Keyboard shortcuts\n  useEffect(() => {\n    const handleKeyDown = (e: KeyboardEvent) => {\n      // Escape to close navigation\n      if (e.key === 'Escape' && navigationState.isOpen) {\n        closeNavigation()\n      }\n      \n      // Ctrl/Cmd + M to toggle mobile menu\n      if ((e.ctrlKey || e.metaKey) && e.key === 'm' && navigationState.isMobile) {\n        e.preventDefault()\n        toggleNavigation()\n      }\n    }\n\n    document.addEventListener('keydown', handleKeyDown)\n    return () => document.removeEventListener('keydown', handleKeyDown)\n  }, [navigationState.isOpen, navigationState.isMobile, closeNavigation, toggleNavigation])\n\n  // Handle outside clicks on mobile\n  useEffect(() => {\n    const handleClickOutside = (e: MouseEvent) => {\n      if (!navigationState.isMobile || !navigationState.isOpen) return\n      \n      const target = e.target as HTMLElement\n      const nav = target.closest('[data-navigation]')\n      \n      if (!nav) {\n        closeNavigation()\n      }\n    }\n\n    if (navigationState.isOpen) {\n      document.addEventListener('mousedown', handleClickOutside)\n      return () => document.removeEventListener('mousedown', handleClickOutside)\n    }\n  }, [navigationState.isOpen, navigationState.isMobile, closeNavigation])\n\n  // Prevent body scroll when mobile menu is open\n  useEffect(() => {\n    if (navigationState.isMobile && navigationState.isOpen) {\n      document.body.style.overflow = 'hidden'\n      return () => {\n        document.body.style.overflow = 'unset'\n      }\n    }\n  }, [navigationState.isMobile, navigationState.isOpen])\n\n  // Focus management for accessibility\n  const handleMenuItemFocus = useCallback((index: number, totalItems: number) => {\n    return {\n      onKeyDown: (e: React.KeyboardEvent) => {\n        switch (e.key) {\n          case 'ArrowDown':\n            e.preventDefault()\n            const nextIndex = (index + 1) % totalItems\n            const nextElement = document.querySelector(`[data-nav-item=\"${nextIndex}\"]`) as HTMLElement\n            nextElement?.focus()\n            break\n            \n          case 'ArrowUp':\n            e.preventDefault()\n            const prevIndex = index === 0 ? totalItems - 1 : index - 1\n            const prevElement = document.querySelector(`[data-nav-item=\"${prevIndex}\"]`) as HTMLElement\n            prevElement?.focus()\n            break\n            \n          case 'Home':\n            e.preventDefault()\n            const firstElement = document.querySelector('[data-nav-item=\"0\"]') as HTMLElement\n            firstElement?.focus()\n            break\n            \n          case 'End':\n            e.preventDefault()\n            const lastElement = document.querySelector(`[data-nav-item=\"${totalItems - 1}\"]`) as HTMLElement\n            lastElement?.focus()\n            break\n        }\n      }\n    }\n  }, [])\n\n  return {\n    ...navigationState,\n    openNavigation,\n    closeNavigation,\n    toggleNavigation,\n    setActiveSection,\n    handleMenuItemFocus,\n    \n    // Utility functions\n    isCurrentPage: (href: string) => {\n      if (href === '/') return pathname === '/'\n      return pathname.startsWith(href)\n    },\n    \n    // Touch gesture support\n    touchHandlers: {\n      onTouchStart: (e: React.TouchEvent) => {\n        const touch = e.touches[0]\n        return { startX: touch.clientX, startY: touch.clientY }\n      },\n      \n      onTouchEnd: (e: React.TouchEvent, startPosition: { startX: number; startY: number }) => {\n        const touch = e.changedTouches[0]\n        const deltaX = touch.clientX - startPosition.startX\n        const deltaY = Math.abs(touch.clientY - startPosition.startY)\n        \n        // Swipe right to open menu (from left edge)\n        if (deltaX > 50 && deltaY < 100 && startPosition.startX < 50) {\n          openNavigation()\n        }\n        \n        // Swipe left to close menu\n        if (deltaX < -50 && deltaY < 100 && navigationState.isOpen) {\n          closeNavigation()\n        }\n      }\n    }\n  }\n}\n\nexport default useNavigation